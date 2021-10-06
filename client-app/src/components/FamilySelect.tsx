import React, { ChangeEvent, useEffect, useState } from "react";
import { Button, Form, Grid, Input, Segment } from "semantic-ui-react";
import api from "../app/api";
import { Family } from "../models/family";

interface Props{
    currentFamily: Family,
    setCurrentFamily: (family: Family)=>void
}

export default function FamilySelect({currentFamily, setCurrentFamily}: Props){
    const [families, setFamilies]=useState<Family[]>([]);
    useEffect(() => {
        api.Families.list().then(response => {
          console.log(response);
          setFamilies(response);
        })
      }, [])

    useEffect(()=>{
        const family = families.find(f=>f.FamilyName === currentFamily.FamilyName);
        console.log('finded family: '+family);
        if (family !== undefined && family.FamilyId !== currentFamily.FamilyId){
            setCurrentFamily(family);
        } 
    }, [families, currentFamily])

    const [familyToAdd, setFamilyToAdd]=useState<string>('');

    const [submiting, setSubmiting]=useState(false);
    
    function addFamily(family: string){
        if(families !== [] && families.some(f=>f.FamilyName === family)){
            console.log(`Family ${family} already exist`);
        } else {
            api.Families.create({FamilyId: '', FamilyName: family, Products: []}).then(response => {
                if(response!==null) {
                    setCurrentFamily(response);
                    setFamilies([...families, response]);
                }
            }).catch((err)=>{
                console.log(err);
            });
        }
    }

    function handleSelectChange(event: ChangeEvent<HTMLSelectElement>){
        const {value}=event.target;
        const family = families.find(f=>f.FamilyName === value);
        console.log(family?.FamilyName + ' Selected');
        if(family !== undefined) {
            setCurrentFamily(family);
        };
    }

    function handleAddFamily(event: ChangeEvent<HTMLInputElement>){
        const {value}=event.target;
        setFamilyToAdd(value);   
    }

    function createFamily(){
        setSubmiting(true);
        addFamily(familyToAdd);
        setSubmiting(false);
    }

    return(
        <>
        <Form.Field label='Family of the product' control='select' value={currentFamily.FamilyName || ''} onChange={handleSelectChange}>
            {families.map(family => (
                <option key={family.FamilyId} value={family.FamilyName}>{family.FamilyName}</option>
            ))}
        </Form.Field>
            <Segment>
                <Input placeholder='Add Family' name='Family' value={familyToAdd || ''} onChange={handleAddFamily}/>
                <Button loading={submiting} onClick={createFamily} type='button'>Create family</Button>
            </Segment>
        </>
    );
}