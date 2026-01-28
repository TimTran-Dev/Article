import { TestBed } from '@angular/core/testing';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { authInterceptor } from './auth.interceptor';
import { AuthService } from '../Services/Authorization/auth.service';
import { vi, describe, it, expect, beforeEach, afterEach, MockInstance } from 'vitest';
import { firstValueFrom } from 'rxjs';

describe('authInterceptor', () => {
  let httpMock: HttpTestingController;
  let httpClient: HttpClient;
  let authService: AuthService;
  let getTokenSpy: MockInstance<() => Promise<string | null>>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting(),
        {
          provide: AuthService,
          useValue: {
            // Initialize as a mock function
            getToken: vi.fn(),
          },
        },
      ],
    });

    httpMock = TestBed.inject(HttpTestingController);
    httpClient = TestBed.inject(HttpClient);
    authService = TestBed.inject(AuthService);

    // Create a typed spy to avoid 'any'
    getTokenSpy = vi.spyOn(authService, 'getToken') as MockInstance<() => Promise<string | null>>;
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should add an Authorization header when a token is present', async () => {
    const mockToken = 'mock-clerk-token-123';
    getTokenSpy.mockResolvedValue(mockToken);

    // Using firstValueFrom handles the async nature of the interceptor pipeline
    const request$ = httpClient.get('/api/test');
    const pendingRequest = firstValueFrom(request$);

    // Give the microtask queue a chance to process the getToken promise
    await vi.waitFor(() => {
      const req = httpMock.expectOne('/api/test');
      expect(req.request.headers.get('Authorization')).toBe(`Bearer ${mockToken}`);
      req.flush({});
    });

    await pendingRequest;
  });

  it('should not add Authorization header if token is null', async () => {
    getTokenSpy.mockResolvedValue(null);

    httpClient.get('/api/test').subscribe();

    // vi.waitFor is great for interceptors that wrap requests in promises/observables
    await vi.waitFor(() => {
      const req = httpMock.expectOne('/api/test');
      expect(req.request.headers.has('Authorization')).toBe(false);
      req.flush({});
    });
  });

  it('should propagate error if getToken fails', async () => {
    const errorMsg = 'Auth failed';
    getTokenSpy.mockRejectedValue(new Error(errorMsg));

    let caughtError: Error | undefined;
    httpClient.get('/api/test').subscribe({
      error: (err: Error) => (caughtError = err),
    });

    // Wait for the rejection to propagate
    await vi.waitFor(() => {
      expect(caughtError?.message).toBe(errorMsg);
    });

    // Verify no request was actually sent
    httpMock.expectNone('/api/test');
  });
});
