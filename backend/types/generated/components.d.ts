import type { Schema, Attribute } from '@strapi/strapi';

export interface ComponentsTitleTeam extends Schema.Component {
  collectionName: 'components_components_title_teams';
  info: {
    displayName: 'TitleTeam';
  };
  attributes: {
    value: Attribute.String;
  };
}

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

export interface ComponentsTextTeam extends Schema.Component {
  collectionName: 'components_components_text_teams';
  info: {
    displayName: 'TextTeam';
  };
  attributes: {
    value: Attribute.Text;
  };
}

export interface ComponentsTeam extends Schema.Component {
  collectionName: 'components_components_teams';
  info: {
    displayName: 'Team';
    description: '';
  };
  attributes: {
    value: Attribute.String;
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
      'components.title-team': ComponentsTitleTeam;
      'components.text': ComponentsText;
      'components.text-team': ComponentsTextTeam;
      'components.team': ComponentsTeam;
      'components.section-title': ComponentsSectionTitle;
    }
  }
}
