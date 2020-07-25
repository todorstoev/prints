export const theme: any = {
    colors: {
        background: '#fff',
        primary: '#037BB6',
        secondary: '#6dc3ea',
        error: 'red',
        muted: 'rgb(204,204,204)',
        highlight: 'hsla(205, 100%, 40%, 0.125)',
    },
    fonts: {
        body: 'system-ui, sans-serif',
        heading: 'system-ui, sans-serif',
        monospace: 'Menlo, monospace',
    },
    fontSizes: [12, 14, 16, 20, 24, 32, 48, 64, 96],
    fontWeights: {
        body: 400,
        heading: 700,
        bold: 700,
    },
    lineHeights: {
        body: 1.5,
        heading: 1.25,
    },
    space: [0, 4, 8, 16, 32, 64, 128, 256, 512],
    sizes: {
        avatar: 120,
        navAvatar: 70,
    },
    radii: {
        default: 4,
        circle: 99999,
    },
    shadows: {
        card: '0 0 4px rgba(0, 0, 0, .125)',
        small: '0 2px 4px -2px rgba(11, 39, 65, 0.3)',
        heavy: `0px 3px 5px -1px rgba(0, 0, 0, 0.2), 0px 6px 10px 0px rgba(0, 0, 0, 0.14), 0px 1px 18px 0px rgba(0, 0, 0, 0);`,
    },
    blueGradient: `linear-gradient(90deg, rgb(3, 77, 127) 0%, 23.389%, rgb(3, 141, 206) 46.778%, 73.389%, rgb(109, 195, 234) 100%);`,
    silverGradient: `linear-gradient(90deg, rgb(245, 248, 249) 0%, 25.4773%, rgb(237, 241, 243) 50.9547%, 75.4773%, rgb(205, 215, 222) 100%)`,
    breakpoints: ['40em', '56em', '64em'],

    // rebass variants

    variants: {
        hr: {
            height: 0,
            borderWidth: 1,
            borderColor: 'secondary',
            borderStyle: 'solid',
            backgroundColor: 'secondary',
        },
        avatar: {
            width: 'avatar',
            height: 'avatar',
            borderRadius: 'circle',
            boxShadow: 'small',
        },
        navAvatar: {
            width: 'navAvatar',
            height: 'navAvatar',
            borderRadius: 'circle',
            transition: 'all linear 0.2s',
            transform: 'scale(0.8)',
            ':hover': {
                cursor: 'pointer',
                transform: 'scale(0.9)',
            },
        },
        card: {
            p: 2,
            bg: 'background',
            boxShadow: 'card',
        },
        link: {
            color: 'primary',
        },
        nav: {
            fontSize: 1,
            fontWeight: 'bold',
            display: 'inline-block',
            p: 2,
            color: 'inherit',
            textDecoration: 'none',
            ':hover,:focus,.active': {
                color: 'gray',
                cursor: 'pointer',
            },
        },
    },
    text: {
        heading: {
            fontFamily: 'heading',
            lineHeight: 'heading',
            fontWeight: 'heading',
        },
        display: {
            fontFamily: 'heading',
            fontWeight: 'heading',
            lineHeight: 'heading',
            fontSize: [5, 6, 7],
        },
        caps: {
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
        },
    },
    buttons: {
        primary: {
            fontWeight: 'body',
            color: 'background',
            bg: 'primary',
            borderRadius: 'default',
            transition: 'all 0.2s linear',
            ':focus': {
                outline: 'none',
            },
            ':hover': {
                filter: 'brightness(110%)',
                cursor: 'pointer',
            },
        },
        secondary: {
            variant: 'buttons.primary',
            color: 'background',
            bg: 'secondary',
        },
        outline: {
            variant: 'buttons.primary',
            color: 'primary',
            bg: 'transparent',
            boxShadow: 'inset 0 0 2px',
        },
        clear: {
            variant: 'buttons.primary',
            bg: 'transparent',
            padding: 0,
        },
    },

    forms: {
        inputAuto: {
            variant: 'forms.input',
            width: 'auto',
            textAlign: 'center',
            margin: 'auto',
            bg: 'transparent',
        },
        input: {
            bg: '#fff',
            borderColor: 'secondary',
            transition: 'all 0.2s linear',
            outline: 'none',
            ':focus': {
                boxShadow: '0 0 0 1px #037BB6',
                borderColor: 'primary',
            },
        },
        select: {
            borderColor: 'rgb(204,204,204)',
            borderRadius: 4,
            ':focus': {
                borderColor: 'primary',
                boxShadow: 'mist',
                outline: 'none',
            },
        },
        textarea: {},
        label: {},
        radio: {},
        checkbox: {},
    },
    styles: {
        root: {
            fontFamily: 'body',
            fontWeight: 'body',
            lineHeight: 'body',
        },
    },
}
