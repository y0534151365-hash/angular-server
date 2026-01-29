# Minimal Change Log
**Angular 21 Safe Modernization**  
**Date:** January 29, 2026

---

## CHANGES TO APPLY

### 🧹 CLEANUP PHASE

#### 1. Remove Console Logs (Dead Code Cleanup)
- **File:** `src/app/features/auth/pages/login-page/login-page.ts`
  - Remove line 61: `console.error('Login failed', err);`
  - **Reason:** Development-only logging

- **File:** `src/app/features/auth/pages/register-page/register-page.ts`
  - Remove line 70: `console.error('Registration failed', err);`
  - **Reason:** Development-only logging

- **File:** `src/app/features/projects/pages/projects-page/projects-page.ts`
  - Remove line 91: `console.log('Project created:', newProject);`
  - Remove line 96: `console.error('Failed to create project:', err);`
  - **Reason:** Development-only logging

- **File:** `src/app/features/teams/pages/teams-page/teams-page.ts`
  - Remove line 85: `console.error('Failed to add member:', err);`
  - **Reason:** Development-only logging

- **File:** `src/app/features/projects/components/project-create-dialog/project-create-dialog.ts`
  - Remove line 40: `console.log('ProjectCreateDialog emitting:', payload);`
  - **Reason:** Development-only logging

#### 2. Remove Broken Static Method
- **File:** `src/app/core/services/token-storage.ts`
  - Remove lines 7-10 (broken static method declaration)
  - **Reason:** Dead code, conflicts with instance method

#### 3. Fix Login Page Constructor (Code Quality)
- **File:** `src/app/features/auth/pages/login-page/login-page.ts`
  - Use `inject()` pattern for consistency with modern Angular
  - Move FormBuilder out of constructor body
  - **Reason:** Cleaner, modern Angular 21 pattern

---

### 📝 TEMPLATE MODERNIZATION (OPTIONAL BUT CONSISTENT)

#### 4. Teams Page: Convert *ngIf → @if, *ngFor → @for
- **File:** `src/app/features/teams/pages/teams-page/teams-page.html`
  - Convert `<ng-container *ngIf>` to `@if` blocks
  - **Reason:** Angular 21 best practice, already done in Tasks page

#### 5. Projects Page: Convert *ngIf → @if, *ngFor → @for
- **File:** `src/app/features/projects/pages/projects-page/projects-page.html`
  - Convert `<ng-container *ngIf>` and `*ngFor` to modern syntax
  - **Reason:** Consistency with Tasks page

---

### ⚡ UX POLISH (OPTIONAL BUT RECOMMENDED)

#### 6. Replace alert() with User-Friendly Messages
- **Files:**
  - `src/app/features/teams/pages/teams-page/teams-page.ts` - Lines 102, 112
  - `src/app/features/projects/pages/projects-page/projects-page.ts` - Line 96
  - `src/app/features/tasks/pages/task-board-page/task-board-page.ts` - Line 110

- **Changes:**
  - Replace `alert()` with component signal (e.g., `successMessage` or `errorMessage`)
  - Add UI element to display message
  - Auto-clear after 3 seconds

- **Reason:** Better UX, professional appearance

---

## SUMMARY TABLE

| Phase | Files Modified | Reason |
|-------|---|---|
| **Cleanup** | 5 files | Remove console logs |
| **Cleanup** | 1 file | Remove dead static method |
| **Code Quality** | 1 file | Modernize DI pattern |
| **Template** | 2 files | @if/@for consistency |
| **UX** | 3 files | Replace alert() |
| **Total** | 12 changes | Safe, minimal, behavior-preserving |

---

## EXECUTION ORDER

1. **Start with Cleanup** (safest, no behavioral risk)
2. **Apply Code Quality** fixes
3. **Modernize Templates** (fully backward-compatible in Angular 21)
4. **Apply UX Polish** (optional, enhances user experience)

