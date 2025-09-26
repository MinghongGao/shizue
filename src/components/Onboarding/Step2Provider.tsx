import { useThemeValue } from '@/hooks/layout';
import { useSetOpenAIEndpoint, useSetOpenAIKey } from '@/hooks/settings';
import { validateApiEndpointAndKey } from '@/lib/validateApiKey';
import { SmileOutlined } from '@ant-design/icons';
import { Button, Input, Select } from 'antd';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

export default function StepProvider({ onBack }: { onBack: () => void }) {
  const [isLoading, setIsLoading] = useState(false);
  const [isInvalidApiKey, setIsInvalidApiKey] = useState(false);
  const [canProceed, setCanProceed] = useState(false);
  const [apiKey, setApiKey] = useState(
    process.env.NODE_ENV === 'development' ? import.meta.env.OPENAI_API_KEY : ''
  );
  const [endpoint, setEndpoint] = useState(
    process.env.NODE_ENV === "development" ? import.meta.env.OPENAPI_ENDPOINT : ""
  )
  const { t } = useTranslation();
  const navigate = useNavigate();

  const setOpenAIKey = useSetOpenAIKey();
  const setOpenAIEndpoint = useSetOpenAIEndpoint();
  const theme = useThemeValue();

  const lines = [
    t('onboarding.selectProvider.title'),
    t('onboarding.selectProvider.openaiApiKey.description_0'),
    t('onboarding.selectProvider.openaiApiKey.description_1'),
    t('onboarding.selectProvider.chatGPTWebApp.description'),
  ];

  const handleSelect = (value: string) => {};

  const onClickValidate = async () => {
    setIsLoading(true);
    const isValid = await validateApiEndpointAndKey(apiKey, endpoint);
    if (isValid) {
      setOpenAIKey(apiKey);
      setOpenAIEndpoint(endpoint);
      setIsInvalidApiKey(false);
      setCanProceed(true);
    } else {
      setIsInvalidApiKey(true);
      setCanProceed(false);
    }
    setIsLoading(false);
  };

  const onClickNext = () => {
    navigate('/chat');
  };

  return (
    <div className="sz:flex sz:flex-col sz:pt-30">
      <div className="sz:text-lg whitespace-pre-wrap sz:min-h-13 sz:w-80 sz:flex sz:items-center sz:justify-center">
        {lines[0]}
      </div>
      <Select
        defaultValue="openai-api-key"
        onChange={handleSelect}
        className="sz:font-ycom"
        options={[
          {
            value: 'openai-api-key',
            label: t('onboarding.selectProvider.openaiApiKey.title'),
            className: 'sz:font-ycom',
          },
          {
            value: 'chatgpt-webapp',
            label: t('onboarding.selectProvider.chatGPTWebApp.title'),
            className: 'sz:font-ycom',
            disabled: true,
          },
        ]}
      />
      <div
        className={`
          sz:flex
          sz:flex-col
          sz:items-start
          sz:w-80
          sz:text-sm
          sz:text-gray-500
          sz:pl-1
          sz:pt-[3px]
          sz:mb-3
        `}
      >
        <div>{lines[1]}</div>
        <div>{lines[2]}</div>
      </div>
      <div className="sz:flex sz:flex-row sz:items-center sz:w-80">
        <Input
          placeholder="https://..."
          className="sz:font-ycom sz:mr-[5px]"
          value={endpoint}
          onChange={(e) => setEndpoint(e.target.value)}
        />
      </div>
      <div className="sz:flex sz:flex-row sz:items-center sz:w-80">
        <Input
          placeholder="sk-XXX......"
          className="sz:font-ycom sz:mr-[5px]"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          status={isInvalidApiKey ? 'error' : undefined}
        />
        <Button
          className="sz:font-semibold sz:text-base sz:font-ycom"
          type="primary"
          onClick={onClickValidate}
          loading={isLoading}
        >
          {isLoading ? null : canProceed ? (
            <SmileOutlined style={{ fontSize: '20px' }} />
          ) : (
            t('onboarding.selectProvider.openaiApiKey.validate')
          )}
        </Button>
      </div>
      <Button
        className={`sz:mt-2 sz:font-semibold sz:text-base sz:font-ycom ${
          theme == 'dark' ? 'sz:text-black' : ''
        }`}
        type="primary"
        disabled={!canProceed || isLoading}
        onClick={onClickNext}
      >
        {t('onboarding.next')}
      </Button>
      <Button
        className="sz:mt-1 sz:font-semibold sz:text-base sz:font-ycom"
        type="dashed"
        onClick={onBack}
      >
        {t('onboarding.back')}
      </Button>
    </div>
  );
}
