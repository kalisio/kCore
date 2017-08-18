<template>
  <k-screen title="Register">
    <div slot="screen-content">
      <div class="column justify-center">
        <!--
          Register form
        -->
        <div>
          <k-form :schema="schema" submitButton="Register" @submitted="onSubmitted" />
        </div>
        <!--
          Additionnal links
        -->
        <div class="self-center">
          <a @click="$router.push({name: 'login'})">
            Already have an account ?
          </a>
        </div>
      </div>
    </div>
  </k-screen>
</template>

<script>
import { KScreen } from '../screen'
import { KForm } from '../form'
import mixins from '../../mixins'

export default {
  name: 'k-register',
  components: {
    KForm,
    KScreen
  },
  dependencies: ['api'],
  data () {
    return {
      schema: {
        "$schema": "http://json-schema.org/draft-06/schema#",
        "$id": "http://kalisio.xyz/schemas/register.json#",
        "title": "Register Form",
        "description": "Authentication registration form",
        "type": "object",
        "properties": {
          "name": { 
            "type": "string", 
            "minLength": 3,
            "maxLength": 128,
            "field": {
              "type": "text",
              "label": "Name",
              "helper": "Type your name",
            }
          },
          "email": { 
            "type": "string", 
            "format": "email",
            "field": {
              "type": "email",
              "label": "Email",
              "helper": "Type your email address",
            }
          },
          "password": { 
            "type": "string",
            "field": {
              "type": "password",
              "label": "Password",
              "helper": "Type your password",
            }
          },
          "confirmPassword": { 
            "const": { 
              "$data": "1/password" 
            },
            "field": {
              "type": "password",
              "label": "Confirm Password",
              "helper": "Type your password again",
            }
          }
        },
        "required": ["name", "email", "password", "confirmPassword"],
        "form": {
          "type": "object",
          "properties":  {
            "icon": false,
            "label": true,
            "labelWidth": 3
          }
        }
      }
    }
  },
  mixins: [mixins.authentication],
  methods: {
    onSubmitted (data) {
      this.register(data)
    }
  }
}
</script>
