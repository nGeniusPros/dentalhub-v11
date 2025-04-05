# MCP Rules System

The MCP Rules System provides a flexible and extensible way to define and enforce rules for the MCP Gateway. Rules can be used for validation, authorization, rate limiting, transformation, and auditing of requests.

## Overview

The rules system consists of the following components:

1. **Rule Engine**: Core component that manages rule registration, execution, and integration with the MCP Gateway.
2. **Rule Interface**: Standard interface that all rules must implement.
3. **Rule Types**: Different types of rules for different purposes (validation, authorization, etc.).
4. **Rule Registry**: Central registry for all rules, managed by the Rule Engine.
5. **Rule Middleware**: Integration with the MCP Gateway to apply rules during request processing.

## Rule Types

The following rule types are supported:

- **Validation Rules**: Validate request structure, parameters, etc.
- **Authorization Rules**: Check if the user is authorized to perform the action.
- **Rate Limiting Rules**: Limit the rate of requests.
- **Transformation Rules**: Transform request data.
- **Audit Rules**: Log or audit requests.
- **Custom Rules**: Custom rules that don't fit into the above categories.

## Using Rules

### Programmatic Rules

You can create and register rules programmatically:

```typescript
import { ValidationRule, RulePriority } from '../mcp/rules';
import { z } from 'zod';

// Create a validation rule
const patientCreateRule = new ValidationRule(
  {
    id: 'patient-create-validation',
    name: 'Patient Creation Validation',
    description: 'Validates patient data during creation',
    priority: RulePriority.HIGHEST,
    enabled: true,
    paths: ['/api/patients'],
    methods: ['POST'],
    adapters: ['patient'],
  },
  {
    bodySchema: z.object({
      email: z.string().email('Invalid email format'),
      name: z.string().min(2, 'Name must be at least 2 characters'),
      // Add more fields as needed
    }),
  }
);

// Register the rule with the rule engine
ruleEngine.registerRule(patientCreateRule);
```

### Configuration-Based Rules

You can also define rules in a configuration file (`mcp-rules-config.json`):

```json
{
  "rules": {
    "validation": {
      "enabled": true,
      "defaultPriority": 0
    }
  },
  "endpoints": {
    "/api/patients": {
      "validation": {
        "POST": {
          "bodySchema": "patientCreateSchema"
        }
      }
    }
  },
  "schemas": {
    "patientCreateSchema": {
      "type": "object",
      "properties": {
        "email": {
          "type": "string",
          "format": "email"
        },
        "name": {
          "type": "string",
          "minLength": 2
        }
      },
      "required": ["email", "name"]
    }
  }
}
```

Then load the rules using the `RuleLoader`:

```typescript
const ruleLoader = new RuleLoader(ruleEngine, supabase);
ruleLoader.loadRules('mcp-rules-config.json');
```

## Rule Execution

Rules are executed in order of priority (lowest number first). If a rule fails, the request is rejected with an error response. If all rules pass, the request is processed by the appropriate adapter.

## Creating Custom Rules

You can create custom rules by extending the `BaseRule` class:

```typescript
import { BaseRule } from '../mcp/rules/BaseRule';
import { RuleContext, RuleResult, RuleType, RulePriority, RuleConfig } from '../mcp/rules/types';

export class MyCustomRule extends BaseRule {
  constructor(config: Omit<RuleConfig, 'type'>) {
    super({
      ...config,
      type: RuleType.CUSTOM,
    });
  }

  execute(context: RuleContext): RuleResult {
    // Implement your custom rule logic here
    if (/* rule passes */) {
      return this.success();
    } else {
      return this.failure('Rule failed', 'CUSTOM_RULE_FAILED', 400);
    }
  }
}
```

## Best Practices

1. **Rule Priority**: Set appropriate priorities for your rules. Validation rules should generally run first, followed by authorization rules, then business logic rules.
2. **Rule Granularity**: Create focused rules that do one thing well, rather than complex rules that do multiple things.
3. **Rule Testing**: Write tests for your rules to ensure they work as expected.
4. **Rule Documentation**: Document your rules, especially custom rules, so others can understand what they do.
5. **Rule Performance**: Be mindful of rule performance, especially for rules that run on every request.

## Example Rules

See the `examples` directory for example rules for different adapters.
