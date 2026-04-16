import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { vi, describe, it, expect, beforeEach, Mock } from 'vitest';
import { UserResource, ActiveSessionResource } from '@clerk/types';

vi.mock('../../../environments/environment', () => ({
  environment: {
    clearkKey: 'pk_test_bW9jay1rZXktZm9yLXRlc3RpbmctcHVycG9zZXM=',
  },
}));

interface MockClerkInstance {
  load: Mock;
  addListener: Mock;
  openSignIn: Mock;
  user: UserResource | null;
  session: Partial<ActiveSessionResource> | null;
}

const { mockInstance } = vi.hoisted(() => ({
  mockInstance: {
    load: vi.fn().mockResolvedValue(undefined),
    addListener: vi.fn(),
    openSignIn: vi.fn(),
    user: null,
    session: null,
  } as MockClerkInstance,
}));

vi.mock('@clerk/clerk-js', () => {
  class MockClerk {
    constructor() {
      return mockInstance;
    }

    load = mockInstance.load;
    addListener = mockInstance.addListener;
    openSignIn = mockInstance.openSignIn;
    user = mockInstance.user;
    session = mockInstance.session;
  }

  return {
    Clerk: MockClerk,

    default: { Clerk: MockClerk },
  };
});

describe('AuthService', () => {
  let service: AuthService;
  let clerk: MockClerkInstance;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      providers: [AuthService],
    });

    service = TestBed.inject(AuthService);

    await service.init();

    clerk = service.getClerkInstance() as unknown as MockClerkInstance;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('#init', () => {
    it('should update user signal when addListener triggers', async () => {
      let listenerCallback: (state: { user: UserResource | null }) => void = () => {
        /* empty */
      };

      clerk.addListener.mockImplementation((cb) => {
        listenerCallback = cb;
      });

      await service.init();

      listenerCallback({ user: null });
      expect(service.user()).toBeNull();

      const mockUser = { id: 'user_123', fullName: 'Test User' } as UserResource;
      listenerCallback({ user: mockUser });
      expect(service.user()).toEqual(mockUser);
    });
  });

  describe('#getToken', () => {
    it('should return token if session exists', async () => {
      const testToken = 'test-jwt-token';

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
