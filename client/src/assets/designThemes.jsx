// src/themeConfig.js

const lightTheme = {
    components: {
        Layout: {
            headerBg: "#ffffff",
            bodyBg: "#ffffff",
            footerBg: "#ffffff",
            siderBg: "#f0f0f0",
        },
        Card: {
            colorTextDescription: '#000000',
            colorTextHeading: '#000000',
            colorBgContainer: '#ffffff',
            actionsLiMargin: '6px 0',
            bodyPadding: '12px'
        },
        Button: {
            defaultBg: '#ffffff',
            defaultColor: '#000000',
            borderRadius: '4px',
            padding: '6px 8px'
        }
    }
};

const darkTheme = {
    components: {
        Layout: {
            headerBg: "#141414",
            bodyBg: "#141414",
            footerBg: "#141414",
            siderBg: "#1f1f1f",
        },
        Card: {
            colorTextDescription: '#ffffff',
            colorTextHeading: '#ffffff',
            colorBgContainer: '#434343',
            actionsLiMargin: '6px 0',
            bodyPadding: '12px'
        },
        Button: {
            defaultBg: '#1f1f1f',
            defaultColor: '#ffffff',
            borderRadius: '4px',
            padding: '6px 8px'
        }
    }
};
// Olive Green: #808000

// Beige: #F5F5DC

// Gold: #FFD700

// Navy Blue: #000080

// Mustard Yellow: #FFDB58

// Coral: #FF7F50
const tealTheme = {
    components: {
        Layout: {
            headerBg: "#E6E6FA",
            bodyBg: "#98FF98",
            footerBg: "#d9d9d9",
            siderBg: "#1f1f1f",
        },
        Card: {
            colorTextDescription: '#ffffff',
            colorTextHeading: '#ffffff',
            colorBgContainer: '#008080',
            actionsLiMargin: '6px 0',
            bodyPadding: '12px'
        },
        Button: {
            defaultBg: '#f1f1f1',
            defaultColor: '#1f1f1f',
            borderRadius: '4px',
            padding: '6px 8px'
        }
    }
};

const dangerTheme = {
    components: {
        Layout: {
            headerBg: "#d9d9d9",
            bodyBg: "#d9d9d9",
            footerBg: "#d9d9d9",
            siderBg: "#1f1f1f",
        },
        Card: {
            colorTextDescription: '#ffffff',
            colorTextHeading: '#ffffff',
            colorBgContainer: '#ff4d4f',
            actionsLiMargin: '6px 0',
            bodyPadding: '12px'
        },
        Button: {
            defaultBg: '#f1f1f1',
            defaultColor: '#1f1f1f',
            borderRadius: '4px',
            padding: '6px 8px'
        }
    }
};

export { lightTheme, darkTheme, tealTheme, dangerTheme };
