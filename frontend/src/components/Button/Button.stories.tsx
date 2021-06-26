import React from 'react';
import { Story, Meta } from '@storybook/react';

import Button, { ButtonProps } from './Button';

import "../../../public/App.css"

export default {
  title: 'Components/Button',
  component: Button,
  argTypes: {
    color: {
      options: ["light", "dark", "red"],
      control: {type: "select"}
    },
    size: {
      options: ["l", "m", "s"],
      control: {type: "select"}
    },
  },
} as Meta;

const Template: Story<ButtonProps> = (args) => <Button {...args} >Button Text</Button>;

export const Light = Template.bind({});
Light.args = {
  color: "light",
  size: "m"
};


export const Dark = Template.bind({});
Dark.args = {
  color: 'dark',
  size: "m"
};

