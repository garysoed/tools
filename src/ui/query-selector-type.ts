import { InstanceofType, UnionType } from '../check';

export const QuerySelectorType = UnionType.builder<Element | Document | DocumentFragment>()
    .addType(InstanceofType(Element))
    .addType(InstanceofType(Document))
    .addType(InstanceofType(DocumentFragment))
    .build();
