import React from 'react';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "../../components/ui/card"
import { Button } from "../../components/ui/button"



const PostCard = ({ post, onEdit, onDelete }) => {
    const { id, title, body } = post;
    return (

        <Card className="text-start bg-[#000000]">
            <CardHeader>
                <p className='text-blue-600 font-bold text-xl mb-3'>{id}</p>
                <CardTitle title={title}
                    className="line-clamp-1 mb-2">{title}</CardTitle>
                <CardDescription
                    className="line-clamp-3 leading-teight"
                    title={body}>
                    {body}
                </CardDescription>
            </CardHeader>
            <CardFooter className="flex justify-between">
                <Button className="uppercase"
                    onClick={() => onEdit(post)}>
                    edit
                </Button>
                <Button variant="destructive" className="uppercase"
                    onClick={() => onDelete(post)}>
                    delete
                </Button>
            </CardFooter>
        </Card>

    );
};

export default PostCard;