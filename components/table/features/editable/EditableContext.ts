import * as React from 'react';

const EditableContext = React.createContext<import('./useEditable').EditableContextValue | null>(null);

export default EditableContext;
