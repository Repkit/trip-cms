<template>
    <div class="drop-down-modal">
		<div class="content">
			<div class="arrow-pointer" ref="arrowpointer"></div>
			<h3 class="title">Editor layout</h3>
			<div class="section">
				<div @click="toggleEditorStyle(i)" class="editor-style-item" v-for="(item,i) in editorstyles" :key="i">
					<div :class="[{active: active == i}, item]" class="editor-style-icon"></div>
					<p>{{item}}</p>
				</div>
			</div>
			<!-- <h3 class="title">General</h3>
			<div class="section">
                <div class="togglecheckbox" @click="togglewrap()" style="display:flex; flex: 100%;">
                    <span :class="['toggle-icon', wrap ? 'checked' : '']"></span>
                    <label>Wrap code</label>
                </div>
				<p></p>
                <div class="togglecheckbox"  @click="togglelines()" style="display:flex; flex: 100%;">
                    <span :class="['toggle-icon', lines ? 'checked' : '']"></span>
                    <label>Show line numbers</label>
                </div>
                <p></p>
			</div> -->
		</div>
    </div>
</template>
<script>
export default {
	props: [
		'width',
		'reference'
	],
	data () {
		return {
			active: false,
			wrap: false,
			lines: true,
			editorstyles: ['split', 'tabs']
		}
	},
	methods: {
		togglewrap (i) {
			this.wrap = !this.wrap
		},
		togglelines (i) {
			this.lines = !this.lines
		},
		toggleEditorStyle (i) {
			this.active = i
			this.$store.dispatch('updateMode', this.editorstyles[i])
		}
	},
	mounted () {
		this.$el.style.width = this.width + 'px'
		this.$el.style.left = (this.reference.settings.offsetLeft - (this.$el.offsetWidth / 2)) + 'px'
		this.$el.style.top = (this.reference.settings.offsetHeight + (this.reference.settings.offsetHeight / 2)) + 'px'
		this.$refs.arrowpointer.style.left = (this.$el.offsetWidth - this.reference.settings.offsetWidth) + 'px'
	},
	computed: {
		mode: {
			get () {
				return this.$store.getters.getMode
			},
			set () {

			}
		}
	}
}
</script>
<style lang="scss">
.drop-down-modal {
    z-index: 9;
    top: 0;
    position: absolute;
    background: #FBFBFB;
    border-radius: 7px;
    width: auto;

	& .content {
		position: relative;
		display: block;
		padding: 14px;
	}

	& .arrow-pointer {
		position: absolute;
		top: -7px;
		left: 0;
		width: 14px;
		height: 14px;
		transform: rotate(45deg);
		background: #FBFBFB;
	}

    &.align-right {
        right: 0;

        &:before {
            left: 75%;
        }
    }

    & select {
        width: 100%;
        border: #E9E9EA solid 1px;
        text-transform: uppercase;
        padding: 7px;
    }

    & .title {
        color: #1C2128;
        text-transform: uppercase;
        font-weight: 700;
        font-size: 12px;
        padding-left: 0;
    }
}
.section {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-start;
    padding-bottom: 7px;
    // border-bottom: #E9E9E9 solid 1px;
}
.editor-style-item {
	padding: 0 7px;
    display: flex;
    align-items: center;

    & p {
		margin-left: 7px;
        text-transform: capitalize;
        color: #1C2128;
    }
    & .editor-style-icon {
        position: relative;
        width: 28px;
        height: 24px;
        border: #bbbbbb solid 1px;
        border-radius: 3px;

        &:before, &:after {
            content: '';
            background: #bbbbbb;
            position: absolute;
        }

        &.split {
            &:before {
                width: 1px;
                height: 100%;
                top: 0;
                left: 50%;
            }
            &:after {
                width: 100%;
                height: 1px;
                top: 50%;
                left: 0;
            }
        }

        &.columns {
            &:before {
                width: 1px;
                height: 100%;
                left: 29%;
                top:0;
            }
            &:after {
                width: 1px;
                height: 100%;
                left: 66%;
                top:0;
            }
        }

        &.tabs {
            &:before {
                width: 100%;
                height: 1px;
                top:35%;
                left:0;
            }
            &:after {
                width: 1px;
                height: 35%;
                left:50%;
                top: 0;
            }
        }

        &:hover {
            border: #64b448 solid 1px;
            &:before, &:after {
                background: #64b448;
            }
        }

        &.active {
            background: #64b448;
            &:before, &:after {
                background: #def3d6;
            }
        }
    }

	&:hover {
		cursor: pointer;
	}
}
</style>
