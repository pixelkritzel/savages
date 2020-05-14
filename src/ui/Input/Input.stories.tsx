import React from 'react';
import { Input } from './Input';

export default {
  title: 'Input',
};
export const normal = () => (
  <>
    <Input value="Text" />
    <br />
    <Input placeholder="Placeholder" />
    <br />
    <Input value="Text" hasError={true} />
    <p>
      Lorem ipsum dolor <Input variant="inline" placeholder="Inline input" />, sit amet consectetur
      adipisicing elit. Minima aliquam possimus culpa rerum veniam sed debitis voluptatum vitae
      accusamus animi. Ducimus ad impedit illum veritatis. Sint alias fuga dolore corporis?
    </p>
  </>
);
