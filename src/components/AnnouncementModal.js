import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const AnnouncementModal = ({ show, handleClose, handleSave, announcement }) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [validated, setValidated] = useState(false);

    useEffect(() => {
        if (announcement) {
            setTitle(announcement.title);
            setContent(announcement.content);
        } else {
            setTitle('');
            setContent('');
        }
        setValidated(false);
    }, [announcement, show]);

    const onSave = () => {
        setValidated(true);

        if (!title || !content) {
            return;
        }

        handleSave({ id: announcement ? announcement.id : null, title, content });
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>{announcement ? '공지사항 수정' : '새 공지사항'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form noValidate validated={validated}>
                    <Form.Group className="mb-3">
                        <Form.Label>제목</Form.Label>
                        <Form.Control 
                            type="text" 
                            value={title} 
                            onChange={(e) => setTitle(e.target.value)} 
                            required 
                            isInvalid={validated && !title}
                        />
                        <Form.Control.Feedback type="invalid">
                            제목을 입력해주세요.
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>내용</Form.Label>
                        <Form.Control 
                            as="textarea" 
                            rows={5} 
                            value={content} 
                            onChange={(e) => setContent(e.target.value)} 
                            required 
                            isInvalid={validated && !content}
                        />
                        <Form.Control.Feedback type="invalid">
                            내용을 입력해주세요.
                        </Form.Control.Feedback>
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>닫기</Button>
                <Button variant="primary" onClick={onSave}>저장</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default AnnouncementModal;
