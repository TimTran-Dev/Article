import { TestBed } from '@angular/core/testing';
import {
  HttpClient,
  provideHttpClient,
  withInterceptors,
  HttpErrorResponse,
} from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { errorInterceptor } from './error.interceptor';
import { ToastService } from '../Services/Toast/toast.service';

describe('errorInterceptor', () => {
  let httpMock: HttpTestingController;
  let httpClient: HttpClient;
  let mockToastService: { show: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    mockToastService = {
      show: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([errorInterceptor])),
        provideHttpClientTesting(),
        { provide: ToastService, useValue: mockToastService },
      ],
    });

    httpMock = TestBed.inject(HttpTestingController);
    httpClient = TestBed.inject(HttpClient);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should catch server-side errors and show a toast', () => {
    const statusText = 'Internal Server Error';

    httpClient.get('/test').subscribe({
      error: (err: HttpErrorResponse) => {
        expect(err.status).toBe(500);
      },
    });

    const req = httpMock.expectOne('/test');

    // Simulate a 500 error
    req.flush('Error body', { status: 500, statusText });

    expect(mockToastService.show).toHaveBeenCalledWith(
      expect.stringContaining('Error 500: Internal Server Error'),
      'error',
    );
  });

  it('should handle client-side ErrorEvents (Network Error)', () => {
    httpClient.get('/test').subscribe({
      error: (err: HttpErrorResponse) => {
        expect(err).toBeTruthy();
      },
    });

    const req = httpMock.expectOne('/test');

    // Simulate a client-side network error
    const mockError = new ErrorEvent('Network error', {
      message: 'No internet connection',
    });

    req.error(mockError);

    expect(mockToastService.show).toHaveBeenCalledWith(
      'Network Error: No internet connection',
      'error',
    );
  });

  it('should use custom error messages from the response body if available', () => {
    httpClient.get('/test').subscribe({
      error: (err) => expect(err).toBeTruthy(),
    });

    const req = httpMock.expectOne('/test');

    // Simulate error where the API returns a specific message field
    req.flush({ message: 'User already exists' }, { status: 400, statusText: 'Bad Request' });

    expect(mockToastService.show).toHaveBeenCalledWith('User already exists', 'error');
  });
});
