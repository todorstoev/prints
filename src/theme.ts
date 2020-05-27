export const theme: any = {
    colors: {
        text: '#000',
        background: '#fff',
        primary: '#023E6B',
        secondary: '#1b2c6059',
        error: '#d93b48',
        muted: '#f6f6f9',
        mist: '#eaf7f8',
        gray: '#dddddf',
        orange: '#F74F04',
        highlight: 'hsla(205, 100%, 40%, 0.125)',
    },
    fonts: {
        body: 'system-ui, sans-serif',
        heading: 'inherit',
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
        avatar: 48,
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

    // rebass variants
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
    variants: {
        avatar: {
            width: 'avatar',
            height: 'avatar',
            borderRadius: 'circle',
            boxShadow: 'card',
            ':hover': {
                cursor: 'pointer',
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
    buttons: {
        primary: {
            fontSize: 2,
            fontWeight: 'bold',
            color: 'background',
            bg: 'primary',
            borderRadius: 'default',
            transition: 'all .1s linear',
            ':focus': {
                outline: 'none',
            },
            ':hover': {
                bg: 'secondary',
                cursor: 'pointer',
            },
        },
        outline: {
            variant: 'buttons.primary',
            color: 'primary',
            bg: 'transparent',
            boxShadow: 'inset 0 0 2px',
        },
        secondary: {
            variant: 'buttons.primary',
            color: 'background',
            bg: 'orange ',
        },
    },
    styles: {
        root: {
            fontFamily: 'body',
            fontWeight: 'body',
            lineHeight: 'body',
        },
    },
    forms: {
        input: {
            transition: 'all 0.2s linear',
            borderWidth: '1px',
            color: 'text',
            ':focus': {
                borderColor: 'primary',
                boxShadow: '0 0 0 1px #030E9C',
                outline: 'none',
            },

            borderColor: 'lightgray',
        },
        select: {
            color: 'text',
            borderColor: 'lightgray',
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
}
