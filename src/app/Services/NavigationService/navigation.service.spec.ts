import { TestBed } from '@angular/core/testing';
import { NavigationService } from './navigation.service';

describe('NavigationService', () => {
  let service: NavigationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NavigationService],
    });
    service = TestBed.inject(NavigationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have showCreateModal initialized to false', () => {
    expect(service.showCreateModal()).toBe(false);
  });

  it('should set showCreateModal to true when openModal is called', () => {
    service.openModal();
    expect(service.showCreateModal()).toBe(true);
  });

  it('should set showCreateModal to false when closeModal is called', () => {
    service.openModal();
    expect(service.showCreateModal()).toBe(true);

    service.closeModal();
    expect(service.showCreateModal()).toBe(false);
  });

  it('should remain true if openModal is called multiple times', () => {
    service.openModal();
    service.openModal();
    expect(service.showCreateModal()).toBe(true);
  });
});
