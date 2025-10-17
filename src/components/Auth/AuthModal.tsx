'use client'

import React, { useState } from 'react'
import { LoginForm } from './LoginForm'
import { RegisterForm } from './RegisterForm'
import { Button } from '@/components/ui/button'
import { cn } from '@/utilities/cn'
import { Modal, ModalContent, ModalTrigger } from '../ui/modal'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  defaultMode?: 'login' | 'register'
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, defaultMode = 'login' }) => {
  const [mode, setMode] = useState<'login' | 'register'>(defaultMode)

  if (!isOpen) return null

  const handleSuccess = () => {
    onClose()
  }

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <Modal isOpen={isOpen} onOpenChange={onClose}>
      <ModalContent>
        <div className="bg-background rounded-lg shadow-xl">
          {mode === 'login' ? (
            <LoginForm onSuccess={handleSuccess} onSwitchToRegister={() => setMode('register')} />
          ) : (
            <RegisterForm onSuccess={handleSuccess} onSwitchToLogin={() => setMode('login')} />
          )}
        </div>
      </ModalContent>
    </Modal>
  )
}
