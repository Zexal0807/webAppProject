import type { Schema, Attribute } from '@strapi/strapi';

export interface ComponentsText extends Schema.Component {
  collectionName: 'components_components_texts';
  info: {
    displayName: 'Text';
    description: '';
  };
  attributes: {
    value: Attribute.Text;
  };
}

export interface ComponentsSectionTitle extends Schema.Component {
  collectionName: 'components_components_section_titles';
  info: {
    displayName: 'SectionTitle';
  };
  attributes: {
    value: Attribute.String;
  };
}

declare module '@strapi/types' {
  export module Shared {
    export interface Components {
      'components.text': ComponentsText;
      'components.section-title': ComponentsSectionTitle;
    }
  }
}
