/**
 * @example
 *
     {
      name: [IsString(), IsNotEmpty()],
      email: [IsString(), IsNotEmpty()],
      password: [IsString(), IsNotEmpty()],
        address: {
            city: [IsString(), IsNotEmpty()],
            street: [IsString(), IsNotEmpty()],
            zipCode: [IsString(), IsNotEmpty()],
        },
        phones: [ IsArray(), IsNotEmpty(), ValidateNested({ each: true }) ],
        'phones.*': [ IsString(), IsNotEmpty() ],
        
    };
  
 */
export type TRule = { [key: string]: PropertyDecorator[] | TRule | TRule[] };

export type TValidationError = { field: string; messages: string[] };
