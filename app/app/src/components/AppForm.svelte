<script lang="ts">
import { onMount } from 'svelte'
import { parse as dotenvParse } from 'dotenv'
import { parse as tomlParse } from 'toml'
import { persistentAtom } from '@nanostores/persistent'

import InputSelect from '~/components/InputSelect.svelte'

// Props
let userClass: string | undefined = undefined
let style: string | undefined = undefined
let locale: string | undefined = undefined
export {
	userClass as class,
	style,
	locale,
}

import { i18nFactory } from '~/i18n'
const _ = i18nFactory(locale as any)

let inputValue = ''
let outputValue = ''
let outputValueElement = null
let convertError: string | null = null

const defaultInputValues = {
	'env': '# .env example to get you started\nHOST=localhost\nPORT=80\nSECRET=secret',
	'json': '{\n  "HOST": "localhost",\n  "PORT": 80,\n  "SECRET": "secret"\n}',
	'toml': '# TOML example to get you started\nHOST = "localhost"\nPORT = 80\nSECRET = "secret"',
}

function getDefaultInputValue(inputType: string)
{
	return defaultInputValues[inputType]
}

function convertFromEnv(input: string)
{
	return dotenvParse(input)
}

function convertFromJson(input: string)
{
	return JSON.parse(input)
}

function convertFromToml(input: string)
{
	return tomlParse(input)
}

function convertFromDockerEnv(input: string)
{
	// Unescape dollar signs (shell variables)
	input = input.replace(/\\\$/g, '$')

	return tomlParse(input)
}

const convertFrom: Record<
	string,
	{
		label: string,
		convert: (input: string) => object,
		swapTo?: keyof typeof convertTo,
	}
> = {
	'env': {
		label: _('.env file'),
		convert: convertFromEnv,
		swapTo: 'env',
	},
	'json': {
		label: _('JSON'),
		convert: convertFromJson,
		swapTo: 'json',
	},
	'toml': {
		label: _('TOML'),
		convert: convertFromToml,
	},
	'docker-env': {
		label: _('Docker .env file'),
		convert: convertFromDockerEnv,
	},
}

function convertToEnv(input: object)
{
	return Object.entries(input)
		.map(([key, value]) =>
			{
				if (typeof value === 'object')
				{
					return `${key}="${JSON.stringify(value).replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`
				}

				if (typeof value === 'string' && value.match(/\s/))
				{
					return `${key}="${value}"`
				}

				return `${key}=${value}`
			})
		.join('\n')
}

function convertToJsonInline(input: object)
{
	return JSON.stringify(input)
}

function convertToJson(input: object)
{
	return JSON.stringify(input, null, 2)
}

function convertToAzure(input: object)
{
	return convertToJson(
		Object.entries(input)
			.map(([key, value]) => ({
				'name': key,
				'value': typeof value === 'object' ? JSON.stringify(value) : value,
				'slotSetting': false,
			}))
	)
}

const convertTo: Record<
	string,
	{
		label: string,
		convert: (input: object) => string,
		swapTo?: keyof typeof convertFrom,
	}
> = {
	'env': {
		label: _('.env file'),
		convert: convertToEnv,
		swapTo: 'env',
	},
	'json_inline': {
		label: _('JSON (inline)'),
		convert: convertToJsonInline,
		swapTo: 'json',
	},
	'json': {
		label: _('JSON (formatted)'),
		convert: convertToJson,
		swapTo: 'json',
	},
	'azure': {
		label: _('Azure'),
		convert: convertToAzure,
	},
}

const inputTypes = Object.entries(convertFrom).reduce((acc, [key, {label}]) =>
	{
		acc[key] = label
		return acc
	}, {} as Record<string, string>)

const outputTypes = Object.entries(convertTo).reduce((acc, [key, {label}]) =>
	{
		acc[key] = label
		return acc
	}, {} as Record<string, string>)

let selectedInputType = persistentAtom<keyof typeof convertFrom>('selectedInputType', Object.keys(inputTypes)[0]!)
let selectedOutputType = persistentAtom<keyof typeof convertTo>('selectedOutputType', Object.keys(outputTypes)[2]!)

let onInputConvertTimeout: number | undefined = undefined

function convert()
{
	if (onInputConvertTimeout)
	{
		clearTimeout(onInputConvertTimeout)
	}

	if (!inputValue)
	{
		outputValue = ''
		convertError = null
		return
	}

	try
	{
		const value = convertFrom[$selectedInputType]?.convert(inputValue)
		outputValue = convertTo[$selectedOutputType]?.convert(value)
		convertError = null
	}
	catch (error)
	{
		outputValue = ''
		convertError = error.message
	}
}

onMount(() =>
	{
		convert()

		selectedInputType.subscribe(value =>
			{
				if (allowDefaultInputValue)
				{
					inputValue = getDefaultInputValue(value)
				}

				convert()
			})

		selectedOutputType.subscribe(_ =>
			{
				convert()
			})
	})

let allowDefaultInputValue: boolean = true

function onInput()
{
	if (onInputConvertTimeout)
	{
		clearTimeout(onInputConvertTimeout)
	}

	allowDefaultInputValue = false

	onInputConvertTimeout = setTimeout(() =>
		{
			convert()
		}, 400)
}

function onChange()
{
	allowDefaultInputValue = false

	convert()
}

function reset()
{
	allowDefaultInputValue = true
	inputValue = getDefaultInputValue($selectedInputType)
	outputValue = ''
	convertError = null

	convert()
}

let canSwap: boolean = false
$: canSwap =
	convertError === null &&
	convertFrom[$selectedInputType]?.swapTo !== undefined &&
	convertFrom[$selectedInputType]?.swapTo !== $selectedOutputType &&
	convertTo[$selectedOutputType]?.swapTo !== undefined &&
	convertTo[$selectedOutputType]?.swapTo !== $selectedInputType

let canCopy: boolean = false
$: canCopy = outputValue !== ''

function swap()
{
	if (!canSwap)
	{
		return
	}

	if (!allowDefaultInputValue)
	{
		// Swap input & output values
		const savedInputValue = inputValue
		inputValue = outputValue
		outputValue = savedInputValue
	}

	// Swap selected input & output types
	const currentInputType = $selectedInputType
	selectedInputType.set(convertTo[$selectedOutputType].swapTo!)
	selectedOutputType.set(convertFrom[currentInputType].swapTo!)
}

function copy()
{
	if (!canCopy)
	{
		return
	}

	navigator.clipboard.writeText(outputValue)
	if (outputValueElement)
	{
		outputValueElement.focus()
		outputValueElement.select()

	}
}
</script>

<div
	class={[
		userClass,
	].join(' ')}
	style={style}
>

	<!-- Two columns for input & output -->
	<div class="grid grid-cols-2 gap-4">
		<!-- Input type -->
		<div class="space-y-4 col-span-2 sm:col-auto">
			<div class="block space-y-2">
				<span class="text-gray-700">
					{_('Input type')}
				</span>
				<InputSelect
					options={inputTypes}
					bind:selectedOption={$selectedInputType}
				/>
			</div>
		</div>

		<!-- Output type -->
		<div class="space-y-4 col-span-2 sm:col-auto row-start-3 sm:row-start-auto">
			<div class="block space-y-2">
				<span class="text-gray-700">
					{_('Output type')}
				</span>
				<InputSelect
					style={'bg-red-500'}
					options={outputTypes}
					bind:selectedOption={$selectedOutputType}
				/>
			</div>
		</div>

		<!-- Input value -->
		<div class="space-y-4 col-span-2 sm:col-auto">
			<label class="block space-y-2 flex flex-col">
				<span class="text-gray-700">
					{_('Input value')}
				</span>
				<div class="h-48 sm:h-64 lg:h-80 xl:h-96">
					<textarea
						class="form-textarea bg-gray-100 block w-full h-full p-2 rounded-md flex-1 resize-none"
						class:default={allowDefaultInputValue}
						placeholder="Enter some text"
						bind:value={inputValue}
						on:input|preventDefault={onInput}
						on:change|preventDefault={onChange}
					></textarea>
				</div>
			</label>

			<div class="flex justify-start sm:justify-end space-x-2 sm:pr-4">
				<button class="btn btn-primary" on:click|preventDefault={convert}>
					{_('Convert')}
				</button>
				<button class="btn btn-secondary" on:click|preventDefault={reset}>
					{_('Reset')}
				</button>
			</div>
		</div>

		<!-- Output value -->
		<div class="space-y-4 col-span-2 sm:col-auto">
			<label class="block space-y-2 flex flex-col">
				<span class="text-gray-700">
					{_('Output value')}
				</span>
				<div class="h-48 sm:h-64 lg:h-80 xl:h-96">
					{#if convertError}
						<textarea
							class="outputValue form-textarea bg-gray-100 block w-full h-full p-2 rounded-md flex-1 resize-none text-gray-600 error"
							value={convertError}
							disabled
						></textarea>
					{:else}
						<textarea
							class="outputValue form-textarea bg-gray-100 block w-full h-full p-2 rounded-md flex-1 resize-none text-gray-600"
							placeholder="Enter some text"
							bind:this={outputValueElement}
							bind:value={outputValue}
							readonly
						></textarea>
					{/if}
				</div>
			</label>

			<div class="flex justify-start space-x-2 sm:pl-4">
				<button
					class="btn btn-secondary"
					disabled={!canSwap}
					on:click|preventDefault={swap}
				>
					{_('Swap')}
				</button>
				<button
					class="btn btn-primary"
					disabled={!canCopy}
					on:click|preventDefault={copy}
				>
					{_('Copy')}
				</button>
			</div>
		</div>
	</div>
</div>

<style lang="scss">
.btn {
	@apply
		bg-gray-400
		enabled:hover:bg-gray-500
		disabled:bg-gray-300
		px-4
		py-2
		text-white
		font-semibold
		rounded-md
		disabled:cursor-not-allowed
		;

	&.btn-primary {
		@apply
			bg-blue-500
			enabled:hover:bg-blue-600
			disabled:bg-blue-300
			;
	}
}

textarea {
	@apply
		border
		border-gray-300
		;

	&.default {
		@apply text-gray-600
	}

	&.error {
		@apply border-red-600 text-red-600;
	}
}

</style>
