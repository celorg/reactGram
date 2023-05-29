import React,{ChangeEvent, useContext, useEffect, useState} from 'react'

import * as ImagePicker from 'expo-image-picker';

import { View, Text, Image, Button,TextInput,StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';

import { AuthContext } from '../../context/AuthContext';
import { api } from '../../utils/api';

import Icon from 'react-native-vector-icons/FontAwesome'

type Props = {}

type UserProps = {
    _id: string,
    profileImage: string,
    name: string,
    email: string,
    bio: string,
    password?: string ,
}

const Profile = (props: Props) => {

    const { user } = useContext(AuthContext);

    const [error, setError] = useState('');
    const [loadingButton, setLoadingButton] = useState(false);

    const [loading, setLoading] = useState(true);

    const [profile, setProfile] = useState<UserProps>({} as UserProps);

    const [name,setName] = useState('');
    const [bio, setBio] = useState('');
    const [password, setPassword] = useState('');

    const [image, setImage] = useState<string | any>('');
    const [previewImage, setPreviewImage] = useState<any>(null); 
    const [objetct, setObjct] = useState<any>()

    const uploads = `http://192.168.78.10:5000/uploads/users/${image}`


    useEffect(() => {

        const getUser = async() => {
            try{
                const response = await api.get("/users/profile")
                    .then((res) => res.data)

                setProfile(response)
                setName(response.name)
                setBio(response.bio)
                setImage(response.profileImage)
            
            }catch(err){
                console.log(err)
            }
            setLoading(false)
        }
        getUser();

    }, []);

    

    const pickDocument = async() => {
        const {status} = await ImagePicker.requestCameraPermissionsAsync();

        if(status !== 'granted'){
            alert("Precisamos da sua autorização, para acessar ás suas fotos");
            return;
        }

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1,
            
        });
      
        const { assets } = result
      
        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
        
        // setObjct({
        //     name: ,
        //     uri: assets[0].uri,
        //     type: 'image/jpg'
        // })
        // console.log(assets[0].type)
    }

    const handleSubmit = async() => {

        setLoadingButton(true);

        const formData = new FormData();

        if(profile.name !== name){
            formData.append("name", name)
        }

        if(profile.bio !== bio){
            formData.append("bio", bio)
        }

        if(image !== profile.profileImage){
            // formData.append("profileImage", {

            // })
        }

        if(profile.password){
            formData.append("password", password)
        }


        const response = await api.patch("/users/", formData, {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'multipart/form-data'
            }
        })
            .then((res) => {
                return res.data
            })
            .catch((err) => {
                setError(err.response.data.errors[0])
            })

        if(response._id){
            setImage(response.profileImage);
            setName(response.name)
            setBio(response.bio)
            setPassword('');
            setProfile(response);
            setPreviewImage(null);
        }

        setLoadingButton(false);

    }

    if(loading){
        return (
            <View style={{flex: 1,backgroundColor:"#121212", justifyContent: 'center', alignItems:'center'}}>
                <ActivityIndicator color="#fff" size={50} />
            </View>
        )    
    }

  return (
    <View style={styles.container}>
            
        <View style={styles.form} >
            <TouchableOpacity style={styles.previewImage} onPress={pickDocument}>
                <Icon name='camera' style={styles.camera} size={25} color="#fff" />
                {(image || !previewImage) && (
                    <Image
                        source={{uri: uploads}}
                        resizeMode='contain'
                        // source={{uri: `data:${uploads}`}}
                        style={styles.image}
                        alt={profile.name}
                        
                    />
                )}
                {previewImage && (
                    <Image
                    source={{uri: previewImage}}
                    resizeMode='contain'
                    // source={{uri: `data:${uploads}`}}
                    style={styles.image}
                    alt={profile.name}
                    />
                )}
            </TouchableOpacity>
                
            {error && (
                <Text style={styles.error}>{error}</Text>
            )}
            <View style={styles.label}>
                <Text style={styles.span} >Nome:</Text>
                <TextInput 
                    placeholder='Digite seu nome'
                    style={styles.input}
                    placeholderTextColor="#aaa"
                    value={name}
                    onChangeText={setName}
                />
            </View>
            <View style={styles.label}>
                <Text style={styles.span}>Bio:</Text>
                <TextInput 
                    placeholder='Digite uma bio'
                    style={styles.input}
                    placeholderTextColor="#aaa"
                    value={bio}
                    onChangeText={setBio}
                />
            </View>
            <View style={styles.label}>
                <Text style={styles.span}>Senha:</Text>
                <TextInput 
                    placeholder='Digite sua senha'
                    style={styles.input}
                    placeholderTextColor="#aaa"
                    secureTextEntry={true}
                    value={password}
                    onChangeText={setPassword}
                />
            </View>
            <TouchableOpacity style={styles.button} disabled={loadingButton} onPress={handleSubmit}>
                {loadingButton ? (
                    <ActivityIndicator size={25} color="#fff" /> 
                ) : (
                    <Text style={styles.textButton}>Atualizar</Text>
                )}
                
            </TouchableOpacity>
        </View>
            
    </View>
  )
}

export default Profile

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingVertical: 20,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#121212',
        color: "#fafafa"
    },
    logo: {
        fontSize: 40,
        fontWeight: 'bold',
        color: "#fafafa",
        marginBottom: 20,
    },
    paragrafo: {
        color: "#fafafa",
        marginBottom: 15,
        fontSize: 18
    },
    error: {
        paddingVertical: 15,
        paddingHorizontal: 8,
        width: "100%",
        textAlign: 'center',
        backgroundColor: '#F8D7DA',
        color: "#842029",
        marginBottom: 10,
        borderRadius: 5
    },
    form: {
        width: "80%",
        maxWidth: 720,
        alignItems: 'center',
        justifyContent: 'center'
    },
    previewImage: {
        width: 200,
        height: 200,
        borderRadius: 100,
        backgroundColor: "#3b3b3b",
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative'
    },
    image: {
        width: "100%",
        height: "100%",
        borderRadius: 100,
        position: 'absolute',
        top: 0
    },
    camera: {
        position: "absolute",
        right: 0,
        bottom: 0,
        backgroundColor: "#0094f6",
        borderRadius: 30,
        padding: 14,
        color: "#fff",
        zIndex: 99
    },
    label: {
        width: '100%',
        flexDirection: 'column',
        marginBottom: 10
    },
    span: {
        color: '#fafafa',
        fontSize: 15,
        marginBottom: 5
    },
    input: {
        width: '100%',
        backgroundColor: "#3b3b3b",
        borderColor: "#5555",
        borderWidth: 2,
        borderRadius: 5,
        paddingHorizontal: 8,
        paddingVertical: 10,
        color: '#fff'
    },
    button: {
        width: "100%",
        paddingVertical: 12,
        marginTop: 10,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: "#0094f6",
        borderRadius: 5
    },
    textButton: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "bold"
    },
    link: {
        marginTop: 40,
        color: '#fafafa',
        textAlign: "left",
        fontSize: 15
    }
})