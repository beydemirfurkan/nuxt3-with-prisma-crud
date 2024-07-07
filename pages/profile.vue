<template>
    <div>
        <h1>Update Profile</h1>
        <form @submit.prevent="updateProfile">
            <div>
                <label for="email">Email:</label>
                <input type="email" v-model="email" />
            </div>
            <div>
                <label for="name">Name:</label>
                <input type="text" v-model="name" />
            </div>
            <div>
                <label for="password">Password:</label>
                <input type="password" v-model="password" />
            </div>
            <button type="submit">Update</button>
        </form>

        <div v-if="user">
            <section>
                <h2>Signatures</h2>
                <ul>
                    <li v-for="signature in user.signatures" :key="signature.id">
                        <div>
                            <p>Name: <input type="text" v-model="signature.name" /></p>
                            <p>Title: <input type="text" v-model="signature.title" /></p>
                            <p>Email: <input type="email" v-model="signature.email" /></p>
                            <button @click="updateSignature(signature)">Update Signature</button>
                            <button @click="deleteSignature(signature.id)">Delete Signature</button>
                        </div>
                    </li>
                </ul>
                <form @submit.prevent="createSignature">
                    <h3>Create Signature</h3>
                    <div>
                        <label for="signatureName">Name:</label>
                        <input type="text" v-model="newSignature.name" />
                    </div>
                    <div>
                        <label for="signatureTitle">Title:</label>
                        <input type="text" v-model="newSignature.title" />
                    </div>
                    <div>
                        <label for="signatureEmail">Email:</label>
                        <input type="email" v-model="newSignature.email" />
                    </div>
                    <div>
                        <label for="signaturePlatformId">Platform ID:</label>
                        <input type="number" v-model="newSignature.platformId" />
                    </div>
                    <button type="submit">Create Signature</button>
                </form>
            </section>
        </div>
    </div>
</template>

<script setup>
const email = ref('')
const name = ref('')
const password = ref('')
const user = ref(null)
const newSignature = ref({ name: '', title: '', email: '', platformId: '' })
const router = useRouter()

const fetchUser = async () => {
    const token = localStorage.getItem('token')
    if (!token) return

    const response = await fetch('/api/user/me', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })

    if (response.ok) {
        const userData = await response.json()
        user.value = userData
        email.value = userData.email
        name.value = userData.name
    }
}

const updateProfile = async () => {
    const token = localStorage.getItem('token')
    const response = await fetch('/api/user/update', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            email: email.value,
            name: name.value,
            password: password.value
        })
    })

    if (response.ok) {
        alert('Profile updated successfully')
    } else {
        console.error('Failed to update profile')
    }
}

const createSignature = async () => {
    const token = localStorage.getItem('token')
    const response = await fetch('/api/signatures', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newSignature.value)
    })

    if (response.ok) {
        alert('Signature created successfully')
        await fetchUser()
    } else {
        console.error('Failed to create signature')
    }
}

const updateSignature = async (signature) => {
    const token = localStorage.getItem('token')
    const response = await fetch(`/api/signatures`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(signature)
    })

    if (response.ok) {
        alert('Signature updated successfully')
        await fetchUser()
    } else {
        console.error('Failed to update signature')
    }
}

const deleteSignature = async (id) => {
    const token = localStorage.getItem('token')
    const response = await fetch(`/api/signatures`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ id })
    })

    if (response.ok) {
        alert('Signature deleted successfully')
        await fetchUser()
    } else {
        console.error('Failed to delete signature')
    }
}


onMounted(fetchUser)
</script>