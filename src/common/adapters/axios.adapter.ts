import { HttpAdapter } from "../interfaces/http-adapter.interface";
import axios, { AxiosInstance } from "axios";
import { Injectable } from "@nestjs/common";

@Injectable()
export class AxiosAdapter implements HttpAdapter {
  private readonly axios: AxiosInstance = axios;

  async get<T>(url: string): Promise<T> {
    try {
      const { data } = await this.axios.get<T>(url);
      return data;
    } catch(error) {
      throw new Error('Error with request GET using axios adapter - CHECK LOGS');
    }
  }
}
