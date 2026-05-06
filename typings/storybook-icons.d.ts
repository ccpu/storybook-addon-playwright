// @storybook/icons uses "exports" in its package.json which is not understood by
// moduleResolution:node. This shim provides the types so TypeScript resolves

// them without changing the global tsconfig moduleResolution setting.
declare module '@storybook/icons' {
  import type * as React from 'react';

  interface IconProps extends React.SVGAttributes<SVGElement> {
    children?: never;
    color?: string;
    size?: number;
  }

  type Icon = React.ForwardRefExoticComponent<
    IconProps & React.RefAttributes<SVGSVGElement>
  >;

  export const ContrastIcon: Icon;
  export const ContrastIgnoredIcon: Icon;
  export const RulerIcon: Icon;
  export const CameraIcon: Icon;
  export const EyeIcon: Icon;
  export const EyeCloseIcon: Icon;
  export const SunIcon: Icon;
  export const MoonIcon: Icon;
  export const SearchIcon: Icon;
  export const ZoomIcon: Icon;
  export const ZoomOutIcon: Icon;
  export const ZoomResetIcon: Icon;
  export const MirrorIcon: Icon;
  export const GrowIcon: Icon;
  export const SwitchAltIcon: Icon;
  export const ComponentIcon: Icon;
  export const GridIcon: Icon;
  export const PhotoIcon: Icon;
  export const StorybookIcon: Icon;
  export const BookIcon: Icon;
  export const DocumentIcon: Icon;
  export const CogIcon: Icon;
  export const EditIcon: Icon;
  export const RefreshIcon: Icon;
  export const SidebarAltIcon: Icon;
  export const BottomBarIcon: Icon;
  export const SyncIcon: Icon;
  export const ChevronRightIcon: Icon;
  export const ShareAltIcon: Icon;
  export const EyeIcon: Icon;
  export const EyeCloseIcon: Icon;
  export const AlertIcon: Icon;
  export const WrenchIcon: Icon;
}
