# Story Animations Behavior

## Current Implementation
- Using Framer Motion with AnimatePresence
- Navigation types: 'forward' | 'backward'
- Slide transitions use 100px offset and 0.3s duration
- State tracked via `navType` and `currentSlideIndex`

## Intended Behavior

### Forward Navigation
1. Current slide should exit to the left (-100px)
2. Next slide should enter from the right (+100px)

### Backward Navigation
1. Current slide should exit to the right (+100px)
2. Previous slide should enter from the left (-100px)

## Current Issues

### Primary Issue: Direction Switch Bug
When changing navigation direction (e.g., going backward multiple times then switching to forward):
- The current slide animation uses the previous navigation type's exit animation
- This causes visual inconsistency where the slide exits in the wrong direction

Example sequence showing the bug:
1. User navigates backward several times (slides exit right correctly)
2. User then navigates forward
3. Current slide incorrectly exits to the right instead of left
4. New slide enters correctly from the right

### Working Scenarios
- Continuous forward navigation works correctly
- Continuous backward navigation works correctly
- Auto-progression after quiz answer works correctly

## Animation Requirements

### Key Principles
1. Animation direction should be determined by the CURRENT navigation action
2. Exit and enter animations should always be paired:
   - Forward: exit left, enter right
   - Backward: exit right, enter left

### Edge Cases to Handle
1. Direction changes (backward → forward)
2. Quiz answer selection auto-progression
3. Keyboard navigation (arrow keys)

## Proposed Solution Direction
We need to ensure the exit animation of the current slide is determined by the new navigation action, not the previous one. This might require:
1. Separating exit/enter animation logic
2. Using AnimatePresence's custom prop more effectively
3. Possibly tracking both current and next slide indices

## Implementation Considerations
- Must maintain current smooth transitions
- Keep existing timing (0.3s) and distance (100px)
- Preserve all working quiz functionality
- Maintain keyboard navigation support 