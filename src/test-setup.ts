import 'zone.js';
import 'zone.js/testing';
import { TestBed } from '@angular/core/testing';
import { BrowserTestingModule, platformBrowserTesting } from '@angular/platform-browser/testing';
import { afterEach } from 'vitest';

// 1. Clear any existing environment (prevents the "Already Instantiated" error)
TestBed.resetTestEnvironment();

// 2. Re-initialize for the current test file
TestBed.initTestEnvironment(BrowserTestingModule, platformBrowserTesting(), {
  // teardown is essential in Vitest 4 to ensure the
  // module is ready for the next file in the same worker.
  teardown: { destroyAfterEach: true },
});

// Add this global hook for Vitest
// It ensures that after every file, the TestBed is reset for the next one
afterEach(() => {
  TestBed.resetTestingModule();
});
