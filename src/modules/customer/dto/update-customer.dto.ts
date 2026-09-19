import {PartialType} from '@nestjs/mapped-types';
import {CreateCustomerReq} from './create-customer.dto.js';

export class UpdateCustomerDto extends PartialType(CreateCustomerReq) {
}