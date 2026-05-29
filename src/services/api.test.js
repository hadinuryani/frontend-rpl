import { describe, it, expect, beforeEach, vi } from 'vitest';
import api from './api';

describe('API Service Wrapper', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
    // Setup global fetch mock
    global.fetch = vi.fn();
  });

  it('should make GET request with default headers', async () => {
    const mockData = { status: 'success', data: { test: 'value' } };
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
    });

    const result = await api.get('/test-endpoint');

    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/test-endpoint'),
      expect.objectContaining({
        method: 'GET',
        headers: expect.objectContaining({
          'Content-Type': 'application/json',
        }),
      })
    );
    expect(result).toEqual(mockData);
  });

  it('should include Authorization header when token exists in localStorage', async () => {
    localStorage.setItem('ic_plus_token', 'my-mock-jwt-token');
    
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ status: 'ok' }),
    });

    await api.get('/secure-endpoint');

    expect(global.fetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        headers: expect.objectContaining({
          'Authorization': 'Bearer my-mock-jwt-token',
        }),
      })
    );
  });

  it('should make POST request with JSON stringified body', async () => {
    const bodyPayload = { name: 'Patient X', age: 30 };
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ status: 'created' }),
    });

    await api.post('/patients', bodyPayload);

    expect(global.fetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify(bodyPayload),
      })
    );
  });

  it('should clear token and dispatch event on 401 Unauthorized response', async () => {
    localStorage.setItem('ic_plus_token', 'expired-token');
    localStorage.setItem('ic_plus_user', '{"id":1}');
    
    global.fetch.mockResolvedValueOnce({
      ok: false,
      status: 401,
      json: async () => ({ error: 'Unauthorized token' }),
    });

    const dispatchSpy = vi.spyOn(window, 'dispatchEvent');

    await expect(api.get('/secure-endpoint')).rejects.toThrow('Unauthorized token');

    expect(localStorage.getItem('ic_plus_token')).toBeNull();
    expect(localStorage.getItem('ic_plus_user')).toBeNull();
    expect(dispatchSpy).toHaveBeenCalledWith(expect.any(Event));
    expect(dispatchSpy.mock.calls[0][0].type).toBe('auth-unauthorized');
  });

  it('should throw an error with backend message when response is not ok', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      status: 400,
      json: async () => ({ message: 'Bad request message from server' }),
    });

    await expect(api.post('/endpoint', {})).rejects.toThrow('Bad request message from server');
  });
});
