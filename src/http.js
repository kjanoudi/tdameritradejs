'use strict'

const debug = require('debug')('ameritrade:client') // eslint-disable-line no-unused-vars

const axios = require('axios').default
const defaults = require('./config')
const token = require('./resources/token')
const EventEmitter = require('eventemitter3')
const interceptors = require('./interceptors')
const rateLimit = require('axios-rate-limit')
const apiKeySuffix = '@AMER.OAUTHAP'

function http(config = {}) {
    this._emitter = new EventEmitter()

    this.on = (event, fn) => this._emitter.on(event, fn)
    this.removeAllListeners = (event) => this._emitter.removeAllListeners(event)

    this.config = Object.assign({}, defaults, config, {
        apiKey: (config.apiKey + '').endsWith(apiKeySuffix)
            ? config.apiKey
            : config.apiKey + apiKeySuffix
    }) // config

    this.isAccessTokenExpired = () => {
        return this.config.accessTokenExpiresAt
            ? new Date(this.config.accessTokenExpiresAt).getTime() <= Date.now()
            : true
    } // isAccessTokenExpired()

    this.isRefreshTokenExpired = () => {
        return this.config.refreshTokenExpiresAt
            ? new Date(this.config.refreshTokenExpiresAt).getTime() <= Date.now()
            : true
    } // isRefreshTokenExpired()

    this.getAccessToken = token.getAccessToken
    this.refreshAccessToken = token.refreshAccessToken

    const instance = axios.create({ baseURL: this.config.baseURL })
    this.axios = rateLimit(instance, this.config.rateLimit)
    interceptors.setup(this)
} // http()

module.exports = http
