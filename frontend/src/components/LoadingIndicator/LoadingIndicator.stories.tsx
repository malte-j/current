import React from 'react';
import { Story, Meta } from '@storybook/react';

import LoadingIndicator from './LoadingIndicator';

import "../../../public/App.css"

export default {
  title: 'Components/LoadingIndicator',
  component: LoadingIndicator,
} as Meta;

const Template: Story = (args) => <LoadingIndicator {...args} >{args.text}</LoadingIndicator>;

export const Default = Template.bind({});
Default.args = {
  text: 'Lade Daten...',
};

