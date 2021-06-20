import React from 'react';
import { Story, Meta } from '@storybook/react';

import Button, { ButtonProps } from './Button';

import "../../App.css"

export default {
  title: 'Example/Button',
  component: Button,
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as Meta;

const Template: Story<ButtonProps> = (args) => <Button {...args} >Button Text</Button>;

export const Light = Template.bind({});
Light.args = {
  color: "light",
  size: "lg"
};

export const Dark = Template.bind({});
Dark.args = {
  color: 'dark',
  onClick: () => {}
  
};

