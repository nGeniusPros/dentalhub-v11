# Vertical Slice Architecture in the MCP Framework

This directory implements the Vertical Slice Architecture pattern for the MCP Gateway Framework. This README explains how the architecture is structured and how to work with it.

## What is Vertical Slice Architecture?

Vertical Slice Architecture is a software design approach that organizes code by feature or business capability ("slices") rather than by technical layer. Each slice contains all the components needed to implement a specific feature, from the user interface down to the data access layer.

### Key Characteristics

- **Feature-Centric Organization**: Code is organized around business features rather than technical concerns
- **Self-Contained Slices**: Each feature slice contains all necessary components
- **Reduced Cross-Cutting Concerns**: Minimizes dependencies between different parts of the application
- **Isolation**: Changes to one feature have minimal impact on others

### Benefits

- **Improved Modularity**: Features are encapsulated, making the codebase easier to understand
- **Better Maintainability**: Developers can work on complete features without affecting other areas
- **Simplified Development**: New team members can understand discrete features without learning the entire system
- **Reduced Cognitive Load**: Developers only need to focus on the relevant slice
- **Easier Testing**: Features can be tested in isolation

## Directory Structure

The features directory is organized by business domain:

```
src/
├── features/
│   ├── patients/
│   │   ├── rules/
│   │   │   └── index.ts
│   │   ├── components/
│   │   ├── services/
│   │   └── types.ts
│   ├── auth/
│   │   ├── rules/
│   │   │   └── index.ts
│   │   ├── components/
│   │   ├── services/
│   │   └── types.ts
│   ├── appointments/
│   │   └── ...
│   └── index.ts
├── mcp/
│   ├── gateway/
│   ├── rules/
│   └── ...
```

Each feature directory contains all the components needed for that feature, including:

- **Rules**: Feature-specific rules (validation, authorization, etc.)
- **Components**: UI components for the feature
- **Services**: Business logic services for the feature
- **Types**: TypeScript types and interfaces for the feature

## Working with Features

### Adding a New Feature

To add a new feature:

1. Create a new directory under `src/features/` with the feature name
2. Create subdirectories for rules, components, services, etc.
3. Implement the feature-specific rules in the `rules/index.ts` file
4. Register the feature rules in `src/features/index.ts`

Example:

```typescript
// src/features/appointments/rules/index.ts
import { RuleEngine } from '../../../mcp/rules';
import { SupabaseClient } from '@supabase/supabase-js';

export function registerAppointmentFeatureRules(ruleEngine: RuleEngine, supabase: SupabaseClient): void {
  // Register appointment-specific rules
}

// src/features/index.ts
import { registerAppointmentFeatureRules } from './appointments/rules';

export function registerAllFeatureRules(ruleEngine: RuleEngine, supabase: SupabaseClient): void {
  // Register existing feature rules
  registerPatientFeatureRules(ruleEngine, supabase);
  registerAuthFeatureRules(ruleEngine, supabase);
  
  // Register new feature rules
  registerAppointmentFeatureRules(ruleEngine, supabase);
}
```

### Rule Types Within Features

Each feature can contain multiple types of rules:

- **Validation Rules**: Validate request data for the feature
- **Authorization Rules**: Control access to the feature
- **Rate Limiting Rules**: Prevent abuse of the feature
- **Transformation Rules**: Transform request data for the feature
- **Audit Rules**: Log and track usage of the feature

All these rule types are co-located within the feature directory, rather than being separated by rule type.

## Best Practices

1. **Keep Features Isolated**: Minimize dependencies between features
2. **Complete Features**: Include all necessary components in the feature directory
3. **Consistent Structure**: Follow the same structure for all features
4. **Clear Boundaries**: Define clear boundaries between features
5. **Feature-Specific Rules**: Create rules that are specific to the feature
6. **Shared Utilities**: Place shared utilities in a common directory outside features

## Integration with MCP Gateway

The MCP Gateway integrates with the vertical slice architecture by:

1. Loading the rule engine
2. Registering all feature rules using `registerAllFeatureRules()`
3. Applying rules during request processing

This approach ensures that all feature-specific rules are applied consistently while maintaining the separation of concerns provided by vertical slice architecture.
