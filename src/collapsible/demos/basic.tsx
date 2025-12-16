import React, { useState } from 'react';
import { Button, Collapsible } from '@dtjoy/dt-design';

export default function Basic() {
    const [isOpen, setOpen] = useState(false);

    const toggle = () => {
        setOpen(!isOpen);
    };

    const collapsed = (
        <ul>
            <li>
                <p> 捻过花惹了白</p>
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
            <Button onClick={toggle}>Toggle</Button>
            <Collapsible isOpen={isOpen}>{collapsed}</Collapsible>
        </div>
    );
}
