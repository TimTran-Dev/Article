import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { vi, describe, it, expect, beforeEach, Mock } from 'vitest';
import { UserResource, ActiveSessionResource } from '@clerk/types';

// -------------------------------------------------------------------------
// 1. Mock the Environment
// -------------------------------------------------------------------------
// This prevents the "Invalid Publishable Key" error by providing a key
// that satisfies basic validation if the real SDK inadvertently loads.
vi.mock('../../../environments/environment', () => ({
  environment: {
    // A dummy key format that often passes basic regex checks
    clearkKey: 'pk_test_bW9jay1rZXktZm9yLXRlc3RpbmctcHVycG9zZXM=',
  },
}));

// -------------------------------------------------------------------------
// 2. Define Mock Types
// -------------------------------------------------------------------------
interface MockClerkInstance {
  load: Mock;
  addListener: Mock;
  openSignIn: Mock;
  user: UserResource | null;
  session: Partial<ActiveSessionResource> | null;
}

// -------------------------------------------------------------------------
// 3. Hoist the Mock Instance
// -------------------------------------------------------------------------
// This ensures the mock object exists before any imports run.
const { mockInstance } = vi.hoisted(() => ({
  mockInstance: {
    load: vi.fn().mockResolvedValue(undefined),
    addListener: vi.fn(),
    openSignIn: vi.fn(),
    user: null,
    session: null,
  } as MockClerkInstance,
}));

// -------------------------------------------------------------------------
// 4. Mock the Clerk SDK
// -------------------------------------------------------------------------
vi.mock('@clerk/clerk-js', () => {
  // We define a Class to satisfy the 'new Clerk()' call in AuthService.
  // Returning 'mockInstance' from the constructor allows us to spy on it later.
  class MockClerk {
    constructor() {
      return mockInstance;
    }
    // Redefine methods to match the class shape for TypeScript
    load = mockInstance.load;
    addListener = mockInstance.addListener;
    openSignIn = mockInstance.openSignIn;
    user = mockInstance.user;
    session = mockInstance.session;
  }

  return {
    Clerk: MockClerk,
    // Add default export just in case your setup imports it that way
    default: { Clerk: MockClerk },
  };
});

// -------------------------------------------------------------------------
// 5. The Test Suite
// -------------------------------------------------------------------------
describe('AuthService', () => {
  let service: AuthService;
  let clerk: MockClerkInstance;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthService],
    });

    service = TestBed.inject(AuthService);

    // Retrieve the instance that was returned by the mock constructor
    clerk = service.getClerkInstance() as unknown as MockClerkInstance;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('#init', () => {
    it('should update user signal when addListener triggers', async () => {
      // Define a callback capture variable
      let listenerCallback: (state: { user: UserResource | null }) => void = () => {};

      // Mock implementation to capture the callback provided by the service
      clerk.addListener.mockImplementation((cb) => {
        listenerCallback = cb;
      });

      await service.init();

      // Test Case 1: Sign Out (null user)
      listenerCallback({ user: null });
      expect(service.user()).toBeNull();

      // Test Case 2: Sign In (mock user)
      const mockUser = { id: 'user_123', fullName: 'Test User' } as UserResource;
      listenerCallback({ user: mockUser });
      expect(service.user()).toEqual(mockUser);
    });
  });

  describe('#getToken', () => {
    it('should return token if session exists', async () => {
      const testToken = 'test-jwt-token';

      // Mock the session object specifically for this test
      clerk.session = {
        getToken: vi.fn().mockResolvedValue(testToken),
      };

      const token = await service.getToken();
      expect(token).toBe(testToken);
    });

    it('should return null if no session exists', async () => {
      clerk.session = null;
      const token = await service.getToken();
      expect(token).toBeNull();
    });
  });
});
