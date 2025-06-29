// wallet/dto/update-pin.input.ts
import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class UpdatePinInput {
  @Field()
  formerPin: string;

  @Field()
  newPin: string;
}
