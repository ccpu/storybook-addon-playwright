import { cx } from '@emotion/css';
import React from 'react';
import { makeStyles } from '../../styles';

interface AccordionContextValue {
  expanded: boolean;
  toggle: (event: React.SyntheticEvent) => void;
}

const AccordionContext = React.createContext<AccordionContextValue>({
  expanded: false,
  toggle: () => undefined,
});

export interface AccordionProps {
  expanded?: boolean;
  onChange?: (event: React.SyntheticEvent, expanded: boolean) => void;
  /** Accepted for MUI compatibility (square corners are always used). */
  square?: boolean;
  /** Accepted for MUI compatibility; ignored. */
  slotProps?: unknown;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

export interface AccordionSummaryProps {
  id?: string;
  'aria-controls'?: string;
  classes?: { content?: string; expanded?: string };
  className?: string;
  children?: React.ReactNode;
}

export interface AccordionDetailsProps {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

const useStyles = makeStyles(
  () => ({
    content: {
      alignItems: 'center',
      display: 'flex',
      flexGrow: 1,
      margin: 0,
      minWidth: 0,
    },
    details: {
      padding: 8,
    },
    root: {
      overflow: 'hidden',
    },
    summary: {
      alignItems: 'center',
      cursor: 'pointer',
      display: 'flex',
      minHeight: 40,
      padding: '0 8px',
      width: '100%',
    },
  }),
  { name: 'Accordion' },
);

/** Collapsible panel, replacing `@mui/material`'s `Accordion`. */
const Accordion: React.FC<AccordionProps> = ({
  expanded = false,
  onChange,
  className,
  style,
  children,
}) => {
  const classes = useStyles();

  const toggle = React.useCallback(
    (event: React.SyntheticEvent) => {
      onChange?.(event, !expanded);
    },
    [expanded, onChange],
  );

  return (
    <AccordionContext.Provider value={{ expanded, toggle }}>
      <div className={cx(classes.root, className)} style={style}>
        {children}
      </div>
    </AccordionContext.Provider>
  );
};

Accordion.displayName = 'Accordion';

/** Clickable header for an {@link Accordion}. */
const AccordionSummary: React.FC<AccordionSummaryProps> = ({
  id,
  classes: classesProp,
  className,
  children,
  ...rest
}) => {
  const classes = useStyles();
  const { expanded, toggle } = React.useContext(AccordionContext);

  return (
    <div
      id={id}
      role="button"
      tabIndex={0}
      aria-expanded={expanded}
      aria-controls={rest['aria-controls']}
      className={cx(classes.summary, className)}
      onClick={toggle}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          toggle(event);
        }
      }}
    >
      <div className={cx(classes.content, classesProp?.content)}>{children}</div>
    </div>
  );
};

AccordionSummary.displayName = 'AccordionSummary';

/** Collapsible body for an {@link Accordion}. */
const AccordionDetails: React.FC<AccordionDetailsProps> = ({
  className,
  style,
  children,
}) => {
  const classes = useStyles();
  const { expanded } = React.useContext(AccordionContext);

  return (
    <div
      className={cx(classes.details, className)}
      style={{ display: expanded ? undefined : 'none', ...style }}
    >
      {children}
    </div>
  );
};

AccordionDetails.displayName = 'AccordionDetails';

export { Accordion, AccordionDetails, AccordionSummary };
