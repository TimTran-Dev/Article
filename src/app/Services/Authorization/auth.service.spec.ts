import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { vi, describe, it, expect, beforeEach } from 'vitest';

// 1. Mock the Clerk SDK before anything else
vi.mock('@clerk/clerk-js', () => {
  return {
    Clerk: vi.fn().mockImplementation(() => ({
      load: vi.fn().mockResolvedValue(undefined),
      addListener: vi.fn(),
      openSignIn: vi.fn(),
      user: null,
      session: null,
    })),
  };
});

describe('AuthService', () => {
  let service: AuthService;
  let mockClerkInstance: any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthService],
    });
    service = TestBed.inject(AuthService);
    mockClerkInstance = (service as any).clerk;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('#init', () => {
    it('should initialize Clerk and set signals', async () => {
      const mockUser = { id: 'user_123', fullName: 'John Doe' };
      mockClerkInstance.user = mockUser;

      await service.init();

      expect(mockClerkInstance.load).toHaveBeenCalled();
      expect(service.user()).toEqual(mockUser);
      expect(service.loaded()).toBe(true);
      expect(mockClerkInstance.addListener).toHaveBeenCalled();
    });

    it('should update user signal when addListener triggers', async () => {
      let listenerCallback: (state: any) => void = () => {};
      mockClerkInstance.addListener.mockImplementation((cb: any) => {
        listenerCallback = cb;
      });

      await service.init();

      // Simulate Clerk state change (e.g., user signs out)
      listenerCallback({ user: null });
      expect(service.user()).toBeNull();

      // Simulate sign in
      const newUser = { id: 'user_456' };
      listenerCallback({ user: newUser });
      expect(service.user()).toEqual(newUser);
    });
  });

  describe('#getToken', () => {
    it('should return null if no session exists', async () => {
      mockClerkInstance.session = null;
      const token = await service.getToken();
      expect(token).toBeNull();
    });

    it('should return token if session exists', async () => {
      mockClerkInstance.session = {
        getToken: vi.fn().mockResolvedValue('test-jwt-token'),
      };

      const token = await service.getToken();
      expect(token).toBe('test-jwt-token');
    });
  });

  describe('#signIn', () => {
    it('should call openSignIn on the clerk instance', () => {
      service.signIn();
      expect(mockClerkInstance.openSignIn).toHaveBeenCalled();
    });
  });
});
