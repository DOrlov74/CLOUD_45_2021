import React, { ChangeEvent, MouseEvent, useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";
import { Button, Form, Grid, Header, Image, Input, Label, Message, Segment } from "semantic-ui-react";
import api from "../app/api";
import { Photo } from "../models/photo";
import { Role, User } from "../models/user";
import { UserContext } from "./UserProvider";

export default function UserForm(){
    const userCtx=React.useContext(UserContext);
    const {userRoles, setUserRoles, roles, setRoles}=userCtx;
    const history = useHistory();
    const {id} = useParams<{id: string}>();
    const initialState={
        Id: '',
        UserName: '',
        Email: '',
        PhoneNumber: '',
        Address: '',
        City: '',
        Token: '',
        Sales: [],
        Photos: [],
        Roles: []
    }
    const [user, setUser]=useState<User>(initialState);
    const [submiting, setSubmiting]=useState(false);
    const [error, setError]=useState("");
    useEffect(()=>{
        if(id){
            api.Users.details(id).then(response => {
                if(response!==null) setUser(response);
            }).catch((err)=>{
                console.log(err);
                setError(err);
            });
        };
    }, [id])
    const newRole={
        Id: '',
        Name: ''
    }
    const [role, setRole]=useState<Role>(newRole);
    const [selectedFile, setSelectedFile]=useState<Blob | null>(null)
    const [userPhotos, setUserPhotos] = useState<Photo[]>([]);

    useEffect(()=>{
        const uPhotos: Photo[] = []
        user?.Photos.map(p=>{
            const photo = userCtx.photos.find(x=>x.Id === p.Id);
            if(photo !== undefined && !userPhotos.some(x=>x.Id === p.Id)) {
                uPhotos.push(photo);
            }
        });
        setUserPhotos(uPhotos);
    }, [user, userCtx.photos])

    function handleSubmit(){
        editUser(user);
    }

    function handleInputChange(event: ChangeEvent<HTMLInputElement>){
        const {name, value}=event.target;
        setUser({...user, [name]: value})
    }
    
    function editUser(user: User){
        setSubmiting(true);
        if (user.Id){
          api.Users.update(user).then(()=>{
            history.push('/');
          })
        } else {
          api.Users.create(user).then(()=>{
            history.push('/');
          })
        }
        setUser(user);
        setSubmiting(false);   
    }

    function closeForm(){
        history.push('/');
    }

    function handleAddRole(event: ChangeEvent<HTMLInputElement>){
        const {value}=event.target;
        setRole({Id: '', Name: value});   
    }

    function createRole(){
        if(role.Id === "" && !roles.some(r=>r.Name === role.Name)){
            setSubmiting(true);
            api.Roles.create({Name: role.Name}).then(response => {
                if(response!==null) setRole(response);
            }).catch((err)=>{
                console.log(err);
                setError(err);
            });
            setSubmiting(false);
        } 
    }

    function addRole(event: MouseEvent){
        console.log(event);
        const target=event.target as HTMLButtonElement;
        if(target.value!=='' && !userRoles.some(r=>r.Name === target.value)){
            const roleFromEvent = {Id: target.id, Name: target.value};
            setRole(roleFromEvent);
            setUser({...user, Roles: [...user.Roles, roleFromEvent.Id]});
            api.Roles.addrole(user.Id, roleFromEvent).then(response => {
                if(response!==null) setUser(response);
            }).catch((err)=>{
                console.log(err);
                setError(err);
            });
        }
    }

    function removeRole(event: MouseEvent){
        console.log(event);
        const target=event.target as HTMLButtonElement;
        if(target.value!=='' && userRoles.some(r=>r.Name === target.value)){
            setRole(newRole);
            setUser({...user, Roles: [...user.Roles.filter(r=>r !== target.id)]});
        }
    }

    function handleAddFile(event: any){
        setSelectedFile(event.target.files[0]);
    }

    function handleUploadFile(){
        if (selectedFile !== null){
            uploadPhoto(selectedFile);
            setSelectedFile(null);
        }
    }

    function setMainImage(id: string){
        const oldPhoto = user.Photos.find(p => p.IsMain);
        const newPhoto = user.Photos.find(p => p.Id === id);
        if (oldPhoto && newPhoto){
            oldPhoto.IsMain = false;
            newPhoto.IsMain = true;
            if (oldPhoto.Id !== null){
                updatePhoto(oldPhoto);
            }
            updatePhoto(newPhoto);
        }
    }

    function updatePhoto(photo: Photo){
        try {
            api.Images.update(photo)
            .then((response)=>{
                if(response!==null){
                    const newUser = user
                    newUser.Photos = user.Photos.filter(p => p.Id === photo.Id || p.Id === null);
                    newUser.Photos.push(response);
                    setUser(newUser);
                    setUserPhotos([...userPhotos.filter(p => p.Id === photo.Id || p.Id === null), response]);
                }
            });
        } catch (error){
            console.log(error)
        }
    }

    async function uploadPhoto (file: Blob) {
        try{
            const response = await api.Images.upload(file);
            const result = response.data;
            const photo = {
                Id: result.PublicId,
                Url: result.Url,
                IsMain: user.Photos.length === 0? true: false,
                UserId: user.Id,
                ProductId: ""
            }
            addPhoto(photo);
        } catch (error){
            console.log(error)
        }
    }

    function addPhoto(photo: Photo){
        try {
            api.Images.create(photo)
            .then((response)=>{
                if(response!==null){
                    const newUser = user
                    newUser.Photos.push(response);
                    setUser(newUser);
                    setUserPhotos([...userPhotos, response]);
                }
            });
        } catch (error){
            console.log(error)
        }
    }

    async function deleteImage(id: string){
        try {
            await api.Images.delete(id)
            .then(()=>{
                const newUser = user
                newUser.Photos = user.Photos.filter(p => p.Id !== id);
                setUser(newUser);
                setUserPhotos(userPhotos.filter(p => p.Id !== id));
            });
        } catch (error){
            console.log(error)
        }
    }

    return(
        <>
            <Grid centered columns={2}>
                <Grid.Column>
                    <Header as='h2'>Edit user "{user.UserName}"</Header>
                    <Segment.Group>
                    <Form onSubmit={handleSubmit} error={error?true:false}>
                        <Segment>
                            <Form.Input required placeholder='User Name' value={user.UserName || ''} name='UserName' onChange={handleInputChange}/>
                            <Form.Input required placeholder='Email' value={user.Email || ''} name='Email' onChange={handleInputChange}/>
                            <Form.Input placeholder='Phone Number' value={user.PhoneNumber || ''} name='PhoneNumber' onChange={handleInputChange}/>
                            <Form.Input placeholder='Address' value={user.Address || ''} name='Address' onChange={handleInputChange}/>
                            <Form.Input placeholder='City' value={user.City || ''} name='City' onChange={handleInputChange}/>
                        </Segment>
                        <Segment>
                            <Grid>
                                <Grid.Row>
                                    <Grid.Column width={8}>
                                        <Header as='h4'>Roles of "{user.UserName}":
                                            <Header.Subheader>Click to remove ...</Header.Subheader>
                                        </Header>
                                    </Grid.Column>
                                    <Grid.Column width={8}>
                                        {userRoles.map(r => (
                                            <Button size='mini' type='button' onClick={removeRole} id={r.Id} value={r.Name} key={r.Id}>{r.Name}</Button>
                                        ))}
                                    </Grid.Column>
                                </Grid.Row>
                                <Grid.Row>
                                    <Grid.Column width={8}>
                                        <Header as='h4'>Available Roles:
                                            <Header.Subheader>Click to add ...</Header.Subheader>
                                        </Header>
                                    </Grid.Column>
                                    <Grid.Column width={8}>
                                        {roles.map(r => (
                                            <Button size='mini' type='button' onClick={addRole} id={r.Id} value={r.Name} key={r.Id}>{r.Name}</Button>
                                        ))}
                                    </Grid.Column>
                                </Grid.Row>
                                <Grid.Row>
                                    <Grid.Column width={16}>
                                        <Input placeholder='Add Role' name='Role' value={role.Name || ''} onChange={handleAddRole}/>
                                        <Button loading={submiting} onClick={createRole} type='button'>Create role</Button>
                                    </Grid.Column>
                                </Grid.Row>
                            </Grid>
                        </Segment>
                        <Segment>
                            <Button loading={submiting} positive type='submit'>Submit</Button>
                            <Button onClick={closeForm} type='button'>Cancel</Button>
                        </Segment>
                        <Segment>
                            <Header as='h4'>{user.UserName}'s images: </Header>
                            <Image.Group size='small'>
                                {userPhotos.map(p => 
                                <div key={p.Id} className='image_container'>
                                    <Image src={p.Url} rounded/>
                                    {p.IsMain? 
                                        <Label className='image_label' color='green'>Main photo</Label>:
                                        <Button loading={submiting} onClick={()=>setMainImage(p.Id)} type='button' className='image_label'>Set as Main</Button>}
                                        <Button loading={submiting} onClick={()=>deleteImage(p.Id)} type='button' className='image_delete' color='orange'>Delete</Button>
                                </div>)}
                            </Image.Group>
                            <Header as='h4'>Choose photo to upload: </Header>
                            <Input type='file' name='file' onChange={handleAddFile}/>
                            <Button disabled={selectedFile === null} onClick={handleUploadFile} type='button' style={{marginTop:'1em'}}>Upload photo</Button>
                        </Segment>
                        <Message error content={error.toString()}/>
                    </Form>
                    </Segment.Group>
                </Grid.Column>
            </Grid>
        </>
    );
}