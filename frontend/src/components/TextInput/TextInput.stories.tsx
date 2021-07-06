import React from 'react';
import { Story, Meta } from '@storybook/react';

import TextInput, {TextInputProps} from './TextInput';

import "../../../public/App.css"

export default {
  title: 'Components/TextInput',
  component: TextInput,
  argTypes: {
    type: {
      options: ['password', 'text', 'search', 'email'],
      control: {type: "select"},
      defaultValue: "text",
    }
  },
} as Meta;

const Template: Story<TextInputProps> = (args) => <TextInput {...args}/>;

export const Text = Template.bind({});
Text.args = {
  label: "Label",
  type: "text",
  placeholder: "Placeholder text fürs Inputelement"  
};


export const Password = Template.bind({});
Password.args = {
  label: "Password",
  type: "password",
  placeholder: "********"  
};


export const Search = Template.bind({});
Search.args = {
  type: "search",
  placeholder: "Suchen nach Posts..."  
};
