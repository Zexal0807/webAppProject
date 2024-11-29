import type { Schema, Attribute } from '@strapi/strapi';

export interface ComponentsVideo extends Schema.Component {
  collectionName: 'components_components_videos';
  info: {
    displayName: 'Video';
  };
  attributes: {
    value: Attribute.String;
  };
}

export interface ComponentsTitle extends Schema.Component {
  collectionName: 'components_components_titles';
  info: {
    displayName: 'Title';
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

export interface ComponentsTeam extends Schema.Component {
  collectionName: 'components_components_teams';
  info: {
    displayName: 'Team';
    description: '';
  };
  attributes: {
    value: Attribute.String;
    members: Attribute.Component<'components.team-members', true>;
  };
}

export interface ComponentsTeamMembers extends Schema.Component {
  collectionName: 'components_components_team_members';
  info: {
    displayName: 'TeamMembers';
  };
  attributes: {
    name: Attribute.String;
    role: Attribute.String;
  };
}

export interface ComponentsImage extends Schema.Component {
  collectionName: 'components_components_images';
  info: {
    displayName: 'Image';
    description: '';
  };
  attributes: {
    value: Attribute.String;
    alt: Attribute.String;
  };
}

declare module '@strapi/types' {
  export module Shared {
    export interface Components {
      'components.video': ComponentsVideo;
      'components.title': ComponentsTitle;
      'components.text': ComponentsText;
      'components.team': ComponentsTeam;
      'components.team-members': ComponentsTeamMembers;
      'components.image': ComponentsImage;
    }
  }
}
