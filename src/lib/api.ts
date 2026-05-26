import { toast } from "sonner";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";
const WS_BASE_URL = import.meta.env.VITE_WS_URL || "ws://localhost:8000/ws";

class ApiClient {
  private getHeaders(options: RequestInit = {}): HeadersInit {
    const headers: HeadersInit = {};
    
    // Only add content type for methods with body
    const method = options.method?.toUpperCase() || "GET";
    if (["POST", "PUT", "PATCH"].includes(method)) {
      headers["Content-Type"] = "application/json";
    }

    const token = localStorage.getItem("token");
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    return headers;
  }

  async request<T>(path: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${path}`;
    const headers = { ...this.getHeaders(options), ...options.headers };
    
    try {
      const response = await fetch(url, { ...options, headers });
      
      const isAuthPath = path.includes("/auth/login") || path.includes("/auth/register");

      if (response.status === 401 && !isAuthPath) {
        // Clear local storage and redirect if token is expired, but not during login/register
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");
        if (window.location.pathname !== "/login" && window.location.pathname !== "/register" && window.location.pathname !== "/") {
          window.location.href = "/login";
        }
        throw new Error("Unauthorized");
      }

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        let errorMessage = "Something went wrong";
        
        if (typeof errData.detail === "string") {
          errorMessage = errData.detail;
        } else if (Array.isArray(errData.detail)) {
          // Handle FastAPI validation error list
          errorMessage = errData.detail.map((d: any) => d.msg).join(", ");
        } else if (errData.message) {
          errorMessage = errData.message;
        }
        
        throw new Error(errorMessage);
      }

      // Handle PDF/binary downloads
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/pdf")) {
        return response.blob() as unknown as T;
      }

      return response.json();
    } catch (error: any) {
      console.error(`API Request Error: ${url}`, error);
      throw error;
    }
  }

  get<T>(path: string, options?: RequestInit): Promise<T> {
    return this.request<T>(path, { ...options, method: "GET" });
  }

  post<T>(path: string, body?: any, options?: RequestInit): Promise<T> {
    return this.request<T>(path, {
      ...options,
      method: "POST",
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  put<T>(path: string, body?: any, options?: RequestInit): Promise<T> {
    return this.request<T>(path, {
      ...options,
      method: "PUT",
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  patch<T>(path: string, body?: any, options?: RequestInit): Promise<T> {
    return this.request<T>(path, {
      ...options,
      method: "PATCH",
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  delete<T>(path: string, options?: RequestInit): Promise<T> {
    return this.request<T>(path, { ...options, method: "DELETE" });
  }
}

export const api = new ApiClient();

// WebSocket Helper
export function connectNotifications(onMessage: (data: any) => void): WebSocket | null {
  const token = localStorage.getItem("token");
  if (!token) return null;

  const socket = new WebSocket(`${WS_BASE_URL}/notifications?token=${token}`);

  socket.onopen = () => {
    console.log("WebSocket notifications connected");
  };

  socket.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      onMessage(data);
    } catch (e) {
      console.error("Error parsing WS message", e);
    }
  };

  socket.onclose = () => {
    console.log("WebSocket notifications disconnected");
  };

  return socket;
}
