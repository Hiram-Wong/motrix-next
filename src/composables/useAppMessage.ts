import { useMessage, type MessageOptions, type MessageReactive } from 'naive-ui'

const DEFAULTS: MessageOptions = {
    closable: true,
    duration: 3000,
    keepAliveOnHover: true,
}

export function useAppMessage() {
    const message = useMessage()
    return {
        success: (content: string, options?: MessageOptions) =>
            message.success(content, { ...DEFAULTS, ...options }),
        error: (content: string, options?: MessageOptions) =>
            message.error(content, { ...DEFAULTS, ...options }),
        warning: (content: string, options?: MessageOptions) =>
            message.warning(content, { ...DEFAULTS, ...options }),
        info: (content: string, options?: MessageOptions) =>
            message.info(content, { ...DEFAULTS, ...options }),
    }
}
