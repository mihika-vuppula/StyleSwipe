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
      justifyContent: 'space-around',
      paddingVertical: 10,
      width: '100%',
  },
  detailsButton: {
        borderWidth: 1,
        borderColor: secondaryColor,
        paddingVertical: 6,
        paddingHorizontal: 10,
        borderRadius: 20,
        alignItems: 'center',
        flex: 1, 
        marginRight: 4,
  },
  detailsButtonText: {
      fontSize: 12,
      fontWeight: 'bold',
  },
  shareButton: {
    borderWidth: 1,
    borderColor: secondaryColor,
    padding: 4,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
},
};
  