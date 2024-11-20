import { StyleSheet } from 'react-native';

export default styles = StyleSheet.create(
    {
        scrollView: {
            flexGrow: 1,
            justifyContent: 'center',
            padding: 20,
        },
        container: {
            flex: 1,
            justifyContent: 'center',
            padding: 20,
        },
        label: {
            fontSize: 18,
            fontWeight: 'bold',
            marginVertical: 8,
            color: '#333',
        },
        input: {
            height: 40,
            borderColor: '#ddd',
            borderWidth: 1,
            borderRadius: 5,
            paddingLeft: 10,
            marginBottom: 15,
            fontSize: 16,
            backgroundColor: '#f9f9f9',
        },
        bottone: {
            backgroundColor: 'blue', // Colore di sfondo del pulsante
            padding: 10,
            borderRadius: 5,
            alignItems: 'center', // Centra il testo all'interno
            marginTop: 10,
            alignSelf: 'center',
        },
        bottoneTesto: {
            color: 'white',
            fontWeight: 'bold',
        },
        view: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 100,
            marginBottom: 50,
        },
    }
);
