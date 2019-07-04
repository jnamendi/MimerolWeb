export class AttributeGroup {
    attributGroupId: number;
    attributeGroupCode: string;
    groupName: string;
    attributes: Array<AttributeModel>;
}

export class AttributeModel {
    attributeId: number;
    attributeCode: string;
    attributeName: string;
}

export enum AttributeGroupType {
    DeliveryTime = "delivery_time",
    DeliveryType = "delivery_type",
    Payment = "payment",
}