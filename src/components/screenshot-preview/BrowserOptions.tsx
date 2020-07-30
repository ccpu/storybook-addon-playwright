import React, { SFC, useCallback } from 'react';
import { useBrowserOptions, BrowsersOption } from '../../hooks/';
import { OptionPopover } from './OptionPopover';
import SettingIcon from '@material-ui/icons/Settings';
import { MemoizedSchemaFormLoader } from '../common';

export interface BrowserOptionsProps {
  browserType: keyof BrowsersOption;
}

const BrowserOptions: SFC<BrowserOptionsProps> = ({ browserType }) => {
  const {
    setBrowserOptions,
    browserOptions,
    hasOption: isActive,
  } = useBrowserOptions(browserType);

  const handleSave = useCallback(
    (data) => {
      setBrowserOptions(browserType, data);
    },
    [browserType, setBrowserOptions],
  );

  if (!browserOptions) return null;

  return (
    <OptionPopover title="Browser Options" Icon={SettingIcon} active={isActive}>
      <MemoizedSchemaFormLoader
        onSave={handleSave}
        type={'BrowserOptions'}
        excludeProps={['extraHTTPHeaders', 'logger']}
        defaultData={browserOptions && browserOptions[browserType]}
      />
    </OptionPopover>
  );
};

BrowserOptions.displayName = 'BrowserOptions';

export { BrowserOptions };
