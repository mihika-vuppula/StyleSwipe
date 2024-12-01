// src/styles/Theme.js

const secondaryColor = '#adafbb';

export const theme = {
    primaryColor: '#DC3A13',
    secondaryColor: secondaryColor,
    negativeColor: '#cd5c5c',
    positiveColor: '#598d56',

    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 30,
        marginTop: 40,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        flex: 1,
    },
    topButton: {
        padding: 8,
        borderWidth: 1,
        borderColor: secondaryColor,
        borderRadius: 8,
    },
    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between', // Adjusted to space buttons appropriately
        alignItems: 'center',            // Align items vertically centered
        paddingVertical: 10,
        width: '100%',
        marginTop: 8,                    // Added marginTop for spacing
    },
    detailsButton: {
        borderWidth: 1,
        borderColor: secondaryColor,
        paddingVertical: 6,
        paddingHorizontal: 10,
        borderRadius: 20,
        alignItems: 'center',
        flex: 1,
        marginRight: 8,                  // Adjusted marginRight for consistent spacing
    },
    detailsButtonText: {
        fontSize: 12,
        fontWeight: 'bold',
    },
    iconButton: {
        marginLeft: 8,                   // Space between icons
        padding: 4,
        borderWidth: 1,
        borderColor: secondaryColor,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    // Removed 'shareButton' since 'iconButton' can be used for both icons
};
