import React, { useState } from 'react';
import { Button, Collapsible } from '@dtjoy/dt-design';

export default function () {
    const [isOpen, setOpen] = useState(false);
    const [isChildOpen, setChildOpen] = useState(false);

    const collapsed = (
        <ul>
            <li>
                <p>捻过花惹了白</p>
            </li>
            <li>
                <p>月下举杯敬沧海</p>
            </li>
            <li>
                <p>憾无穷 人生长恨水长东</p>
            </li>
            <li>
                <p>天涯去后乡关外 听风声诉幽怀</p>
            </li>
            <li>
                <p>繁华落尽终是一场空</p>
            </li>
        </ul>
    );
    return (
        <div>
            <Button onClick={() => setOpen(!isOpen)}>Toggle</Button>
            <br />
            <Collapsible isOpen={isOpen}>
                <div>
                    <span>憾无穷 人生长恨水长东</span>
                    <Button onClick={() => setChildOpen(!isChildOpen)}>Toggle List</Button>
                </div>
                <Collapsible isOpen={isChildOpen}>{collapsed}</Collapsible>
            </Collapsible>
        </div>
    );
}
